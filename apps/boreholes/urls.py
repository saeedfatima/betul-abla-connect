from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BoreholeViewSet

app_name = 'boreholes'

router = DefaultRouter()
router.register(r'', BoreholeViewSet, basename='borehole')

urlpatterns = [
    path('', include(router.urls)),
]