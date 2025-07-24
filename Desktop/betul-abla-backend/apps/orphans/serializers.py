from rest_framework import serializers
from .models import Orphan

class OrphanSerializer(serializers.ModelSerializer):
    age = serializers.ReadOnlyField()
    photo_url = serializers.ReadOnlyField()
    
    class Meta:
        model = Orphan
        fields = [
            'id', 'full_name', 'date_of_birth', 'age', 'gender',
            'address', 'guardian_name', 'guardian_phone',
            'school_name', 'education_level', 'health_status', 'special_needs',
            'monthly_allowance', 'last_payment_date', 'photo_url',
            'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'age', 'photo_url']
    
    def create(self, validated_data):
        # Automatically set the created_by field to the current user
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)

class OrphanListSerializer(serializers.ModelSerializer):
    age = serializers.ReadOnlyField()
    photo_url = serializers.ReadOnlyField()
    
    class Meta:
        model = Orphan
        fields = [
            'id', 'full_name', 'age', 'gender', 'address',
            'guardian_name', 'monthly_allowance', 'status',
            'photo_url', 'created_at'
        ]

class OrphanStatsSerializer(serializers.Serializer):
    total_orphans = serializers.IntegerField()
    active_orphans = serializers.IntegerField()
    pending_orphans = serializers.IntegerField()
    inactive_orphans = serializers.IntegerField()
    total_monthly_budget = serializers.DecimalField(max_digits=12, decimal_places=2)
    avg_monthly_allowance = serializers.DecimalField(max_digits=10, decimal_places=2)