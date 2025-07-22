from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Avg, Count
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Orphan
from .serializers import OrphanSerializer, OrphanListSerializer, OrphanStatsSerializer

class OrphanViewSet(viewsets.ModelViewSet):
    queryset = Orphan.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'gender', 'education_level', 'health_status']
    search_fields = ['full_name', 'guardian_name', 'address', 'school_name']
    ordering_fields = ['full_name', 'date_of_birth', 'created_at', 'monthly_allowance']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return OrphanListSerializer
        return OrphanSerializer
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        stats_data = {
            'total_orphans': Orphan.objects.count(),
            'active_orphans': Orphan.objects.filter(status='active').count(),
            'pending_orphans': Orphan.objects.filter(status='pending').count(),
            'inactive_orphans': Orphan.objects.filter(status='inactive').count(),
            'total_monthly_budget': Orphan.objects.filter(status='active').aggregate(
                total=Sum('monthly_allowance')
            )['total'] or 0,
            'avg_monthly_allowance': Orphan.objects.filter(status='active').aggregate(
                avg=Avg('monthly_allowance')
            )['avg'] or 0,
        }
        
        serializer = OrphanStatsSerializer(stats_data)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        orphan = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(Orphan.STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        orphan.status = new_status
        orphan.save()
        
        serializer = self.get_serializer(orphan)
        return Response(serializer.data)