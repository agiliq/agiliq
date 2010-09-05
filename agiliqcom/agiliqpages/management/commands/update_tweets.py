
import sys
import tweepy

from django.conf import settings
from django.core.management.base import NoArgsCommand

from bettertwitter import Twitter
from agiliqpages.models import Tweet

class Command(NoArgsCommand):
    help = 'Update the tweets of user'

    def handle_noargs(self, **options):
        auth = tweepy.OAuthHandler(settings.TWITTER_CONSUMER_KEY, settings.TWITTER_CONSUMER_SECRET)
        auth.set_access_token(settings.TWITTER_ACCESS_KEY, settings.TWITTER_ACCESS_SECRET)
        
        api = tweepy.API(auth)
        
        for scr_name in settings.TWITTER_FOLLOW:
            user_tweets = api.user_timeline(screen_name=scr_name)
            for tweet in user_tweets:
                tweet_id = tweet.id
                tweet_exists = Tweet.objects.filter(tweet_id=tweet_id).count()
                if tweet_exists:
                    continue
                else:
                    Tweet.objects.create(screen_name = tweet.user.screen_name, 
                                         text=tweet.text,
                                         tweet_id=tweet_id)

