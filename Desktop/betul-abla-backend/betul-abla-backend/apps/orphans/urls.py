from django.urls import path
from . import views

app_name = 'orphans'

urlpatterns = [
    path('', views.orphan_list, name='orphan_list'),
]