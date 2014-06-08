from django.views.generic.edit import FormView

from .forms import FieldTypeForm


class HomeView(FormView):
    template_name = "parsleydemo/home.html"
    form_class = FieldTypeForm
    success_url = '/'
