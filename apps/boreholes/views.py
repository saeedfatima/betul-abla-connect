from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Avg, Count
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Borehole
from .serializers import BoreholeSerializer, BoreholeListSerializer, BoreholeStatsSerializer

class BoreholeViewSet(viewsets.ModelViewSet):
    queryset = Borehole.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'water_quality']
    search_fields = ['name', 'location', 'community_served']
    ordering_fields = ['name', 'location', 'installation_date', 'beneficiaries_count']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return BoreholeListSerializer
        return BoreholeSerializer
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        stats_data = {
            'total_boreholes': Borehole.objects.count(),
            'active_boreholes': Borehole.objects.filter(status='active').count(),
            'maintenance_boreholes': Borehole.objects.filter(status='maintenance').count(),
            'total_beneficiaries': Borehole.objects.filter(status='active').aggregate(
                total=Sum('beneficiaries_count')
            )['total'] or 0,
            'avg_beneficiaries_per_borehole': Borehole.objects.filter(status='active').aggregate(
                avg=Avg('beneficiaries_count')
            )['avg'] or 0,
        }
        
        serializer = BoreholeStatsSerializer(stats_data)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        borehole = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(Borehole.STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        borehole.status = new_status
        borehole.save()
        
        serializer = self.get_serializer(borehole)
        return Response(serializer.data)