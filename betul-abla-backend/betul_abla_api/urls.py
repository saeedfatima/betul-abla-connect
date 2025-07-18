from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def api_root(request):
    return Response({
        'message': 'Betul Abla Foundation API',
        'version': '1.0',
        'endpoints': {
            'auth': '/api/auth/',
            'orphans': '/api/orphans/',
            'boreholes': '/api/boreholes/',
            'reports': '/api/reports/',
            'admin': '/admin/',
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api_root'),
    path('api/auth/', include('apps.authentication.urls')),
    path('api/core/', include('apps.core.urls')),
    path('api/orphans/', include('apps.orphans.urls')),
    path('api/boreholes/', include('apps.boreholes.urls')),
    path('api/reports/', include('apps.reports.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)