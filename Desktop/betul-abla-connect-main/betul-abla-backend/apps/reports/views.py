from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Report
from .serializers import ReportSerializer, ReportListSerializer, ReportStatsSerializer

class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'report_type', 'orphan', 'borehole']
    search_fields = ['title', 'content']
    ordering_fields = ['title', 'created_at', 'published_at']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ReportListSerializer
        return ReportSerializer
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        current_month = timezone.now().replace(day=1)
        
        stats_data = {
            'total_reports': Report.objects.count(),
            'draft_reports': Report.objects.filter(status='draft').count(),
            'published_reports': Report.objects.filter(status='published').count(),
            'reports_this_month': Report.objects.filter(
                created_at__gte=current_month
            ).count(),
        }
        
        serializer = ReportStatsSerializer(stats_data)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        report = self.get_object()
        
        if report.status != 'approved':
            return Response(
                {'error': 'Report must be approved before publishing'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        report.status = 'published'
        report.published_at = timezone.now()
        report.save()
        
        serializer = self.get_serializer(report)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        report = self.get_object()
        
        report.status = 'approved'
        report.reviewed_by = request.user
        report.save()
        
        serializer = self.get_serializer(report)
        return Response(serializer.data)