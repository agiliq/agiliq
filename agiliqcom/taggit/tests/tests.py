from django.test import TestCase, TransactionTestCase

from taggit.models import Tag, TaggedItem
from taggit.tests.forms import FoodForm, DirectFoodForm, CustomPKFoodForm
from taggit.tests.models import (Food, Pet, HousePet, DirectFood, DirectPet,
    DirectHousePet, TaggedPet, CustomPKFood, CustomPKPet, CustomPKHousePet,
    TaggedCustomPKPet)


class BaseTaggingTest(object):
    def assert_tags_equal(self, qs, tags, sort=True):
        got = map(lambda tag: tag.name, qs)
        if sort:
            got.sort()
            tags.sort()
        self.assertEqual(got, tags)

class BaseTaggingTestCase(TestCase, BaseTaggingTest):
    pass

class BaseTaggingTransactionTestCase(TransactionTestCase, BaseTaggingTest):
    pass


class TagModelTestCase(BaseTaggingTransactionTestCase):
    food_model = Food

    def test_unique_slug(self):
        apple = self.food_model.objects.create(name="apple")
        apple.tags.add("Red", "red")

class TagModelDirectTestCase(TagModelTestCase):
    food_model = DirectFood

class TagModelCustomPKTestCase(TagModelTestCase):
    food_model = CustomPKFood


class TaggableManagerTestCase(BaseTaggingTestCase):
    food_model = Food
    pet_model = Pet
    housepet_model = HousePet
    taggeditem_model = TaggedItem
    
    def test_add_tag(self):
        apple = self.food_model.objects.create(name="apple")
        self.assertEqual(list(apple.tags.all()), [])
        self.assertEqual(list(self.food_model.tags.all()),  [])

        apple.tags.add('green')
        self.assert_tags_equal(apple.tags.all(), ['green'])
        self.assert_tags_equal(self.food_model.tags.all(), ['green'])

        pear = self.food_model.objects.create(name="pear")
        pear.tags.add('green')
        self.assert_tags_equal(pear.tags.all(), ['green'])
        self.assert_tags_equal(self.food_model.tags.all(), ['green'])

        apple.tags.add('red')
        self.assert_tags_equal(apple.tags.all(), ['green', 'red'])
        self.assert_tags_equal(self.food_model.tags.all(), ['green', 'red'])

        self.assert_tags_equal(
            self.food_model.tags.most_common(),
            ['green', 'red'],
            sort=False
        )

        apple.tags.remove('green')
        self.assert_tags_equal(apple.tags.all(), ['red'])
        self.assert_tags_equal(self.food_model.tags.all(), ['green', 'red'])
        tag = Tag.objects.create(name="delicious")
        apple.tags.add(tag)
        self.assert_tags_equal(apple.tags.all(), ["red", "delicious"])
        
        apple.delete()
        self.assert_tags_equal(self.food_model.tags.all(), ["green"])

    def test_require_pk(self):
        food_instance = self.food_model()
        self.assertRaises(ValueError, lambda: food_instance.tags.all())
    
    def test_delete_obj(self):
        apple = self.food_model.objects.create(name="apple")
        apple.tags.add("red")
        self.assert_tags_equal(apple.tags.all(), ["red"])
        strawberry = self.food_model.objects.create(name="strawberry")
        strawberry.tags.add("red")
        apple.delete()
        self.assert_tags_equal(strawberry.tags.all(), ["red"])
    
    def test_delete_bulk(self):
        apple = self.food_model.objects.create(name="apple")
        kitty = self.pet_model.objects.create(pk=apple.pk,  name="kitty")
        
        apple.tags.add("red", "delicious", "fruit")
        kitty.tags.add("feline")
        
        self.food_model.objects.all().delete()

        self.assert_tags_equal(kitty.tags.all(), ["feline"])
    
    def test_lookup_by_tag(self):
        apple = self.food_model.objects.create(name="apple")
        apple.tags.add("red", "green")
        pear = self.food_model.objects.create(name="pear")
        pear.tags.add("green")

        self.assertEqual(
            list(self.food_model.objects.filter(tags__in=["red"])),
            [apple]
        )
        self.assertEqual(
            list(self.food_model.objects.filter(tags__in=["green"])),
            [apple, pear]
        )

        kitty = self.pet_model.objects.create(name="kitty")
        kitty.tags.add("fuzzy", "red")
        dog = self.pet_model.objects.create(name="dog")
        dog.tags.add("woof", "red")
        self.assertEqual(
            list(self.food_model.objects.filter(tags__in=["red"]).distinct()),
            [apple]
        )

        tag = Tag.objects.get(name="woof")
        self.assertEqual(list(self.pet_model.objects.filter(tags__in=[tag])), [dog])

        cat = self.housepet_model.objects.create(name="cat", trained=True)
        cat.tags.add("fuzzy")

        self.assertEqual(
            map(lambda o: o.pk, self.pet_model.objects.filter(tags__in=["fuzzy"])),
            [kitty.pk, cat.pk]
        )

    def test_similarity_by_tag(self):
        """Test that pears are more similar to apples than watermelons"""
        apple = self.food_model.objects.create(name="apple")
        apple.tags.add("green", "juicy", "small", "sour")

        pear = self.food_model.objects.create(name="pear")
        pear.tags.add("green", "juicy", "small", "sweet")

        watermelon = self.food_model.objects.create(name="watermelon")
        watermelon.tags.add("green", "juicy", "large", "sweet")

        similar_objs = apple.tags.similar_objects()
        self.assertEqual(similar_objs, [pear, watermelon])
        self.assertEqual(map(lambda x: x.similar_tags, similar_objs), [3, 2])

    def test_tag_reuse(self):
        apple = self.food_model.objects.create(name="apple")
        apple.tags.add("juicy", "juicy")
        self.assert_tags_equal(apple.tags.all(), ['juicy'])

    def test_query_traverse(self):
        spot = self.pet_model.objects.create(name='Spot')
        spike = self.pet_model.objects.create(name='Spike')
        spot.tags.add('scary')
        spike.tags.add('fluffy')
        lookup_kwargs = {'%s__name' % (self.pet_model._meta.object_name.lower()): 'Spot'}
        self.assert_tags_equal(
           [i.tag for i in self.taggeditem_model.objects.filter(**lookup_kwargs)],
           ['scary']
        )


class TaggableManagerDirectTestCase(TaggableManagerTestCase):
    food_model = DirectFood
    pet_model = DirectPet
    housepet_model = DirectHousePet
    taggeditem_model = TaggedPet

class TaggableManagerCustomPKTestCase(TaggableManagerTestCase):
    food_model = CustomPKFood
    pet_model = CustomPKPet
    housepet_model = CustomPKHousePet
    taggeditem_model = TaggedCustomPKPet

    def test_require_pk(self):
        # TODO with a charfield pk, pk is never None, so taggit has no way to
        # tell if the instance is saved or not
        pass

class TaggableFormTestCase(BaseTaggingTestCase):
    form_class = FoodForm
    food_model = Food
    
    def test_form(self):
        self.assertEqual(self.form_class.base_fields.keys(), ['name', 'tags'])

        f = self.form_class({'name': 'apple', 'tags': 'green, red, yummy'})
        self.assertEqual(str(f), """<tr><th><label for="id_name">Name:</label></th><td><input id="id_name" type="text" name="name" value="apple" maxlength="50" /></td></tr>\n<tr><th><label for="id_tags">Tags:</label></th><td><input type="text" name="tags" value="green, red, yummy" id="id_tags" /></td></tr>""")
        f.save()
        apple = self.food_model.objects.get(name='apple')
        self.assert_tags_equal(apple.tags.all(), ['green', 'red', 'yummy'])

        f = self.form_class({'name': 'apple', 'tags': 'green, red, yummy, delicious'}, instance=apple)
        f.save()
        apple = self.food_model.objects.get(name='apple')
        self.assert_tags_equal(apple.tags.all(), ['green', 'red', 'yummy', 'delicious'])
        self.assertEqual(self.food_model.objects.count(), 1)
        
        f = self.form_class({"name": "raspberry"})
        raspberry = f.save()
        self.assert_tags_equal(raspberry.tags.all(), [])
        
        f = self.form_class(instance=apple)
        self.assertEqual(str(f), """<tr><th><label for="id_name">Name:</label></th><td><input id="id_name" type="text" name="name" value="apple" maxlength="50" /></td></tr>\n<tr><th><label for="id_tags">Tags:</label></th><td><input type="text" name="tags" value="green, red, yummy, delicious" id="id_tags" /></td></tr>""")

class TaggableFormDirectTestCase(TaggableFormTestCase):
    form_class = DirectFoodForm
    food_model = DirectFood

class TaggableFormCustomPKTestCase(TaggableFormTestCase):
    form_class = CustomPKFoodForm
    food_model = CustomPKFood
