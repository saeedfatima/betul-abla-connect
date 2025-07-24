from rest_framework import serializers
from .models import Borehole

class BoreholeSerializer(serializers.ModelSerializer):
    coordinates = serializers.ReadOnlyField()
    
    class Meta:
        model = Borehole
        fields = [
            'id', 'name', 'location', 'community_served',
            'latitude', 'longitude', 'coordinates',
            'depth_meters', 'water_quality', 'installation_date',
            'last_maintenance', 'beneficiaries_count', 'status',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'coordinates']
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)

class BoreholeListSerializer(serializers.ModelSerializer):
    coordinates = serializers.ReadOnlyField()
    
    class Meta:
        model = Borehole
        fields = [
            'id', 'name', 'location', 'community_served',
            'coordinates', 'water_quality', 'beneficiaries_count',
            'status', 'created_at'
        ]

class BoreholeStatsSerializer(serializers.Serializer):
    total_boreholes = serializers.IntegerField()
    active_boreholes = serializers.IntegerField()
    maintenance_boreholes = serializers.IntegerField()
    total_beneficiaries = serializers.IntegerField()
    avg_beneficiaries_per_borehole = serializers.DecimalField(max_digits=10, decimal_places=2)