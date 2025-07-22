from rest_framework import serializers
from .models import Report

class ReportSerializer(serializers.ModelSerializer):
    file_url = serializers.ReadOnlyField()
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    reviewed_by_name = serializers.CharField(source='reviewed_by.get_full_name', read_only=True)
    
    class Meta:
        model = Report
        fields = [
            'id', 'title', 'report_type', 'content', 'orphan', 'borehole',
            'file_url', 'status', 'created_by_name', 'reviewed_by_name',
            'created_at', 'updated_at', 'published_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'file_url', 'created_by_name', 'reviewed_by_name']
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)

class ReportListSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    
    class Meta:
        model = Report
        fields = [
            'id', 'title', 'report_type', 'status',
            'created_by_name', 'created_at', 'published_at'
        ]

class ReportStatsSerializer(serializers.Serializer):
    total_reports = serializers.IntegerField()
    draft_reports = serializers.IntegerField()
    published_reports = serializers.IntegerField()
    reports_this_month = serializers.IntegerField()