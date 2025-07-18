from django.urls import path
from . import views

app_name = 'boreholes'

urlpatterns = [
    path('', views.borehole_list, name='borehole_list'),
]