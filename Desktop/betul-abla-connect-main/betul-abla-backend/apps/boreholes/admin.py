from django.contrib import admin
from .models import Borehole

@admin.register(Borehole)
class BoreholeAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'status', 'depth', 'water_level', 'installation_date', 'last_maintenance')
    list_filter = ('status', 'borehole_type', 'installation_date', 'last_maintenance', 'created_at')
    search_fields = ('name', 'location', 'community', 'contractor_name')
    list_editable = ('status', 'water_level')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-installation_date',)
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'location', 'community', 'coordinates', 'status')
        }),
        ('Technical Details', {
            'fields': ('borehole_type', 'depth', 'water_level', 'pump_type', 'capacity')
        }),
        ('Installation & Maintenance', {
            'fields': ('installation_date', 'contractor_name', 'contractor_contact', 
                      'last_maintenance', 'maintenance_notes')
        }),
        ('Financial', {
            'fields': ('installation_cost', 'maintenance_cost')
        }),
        ('Documentation', {
            'fields': ('photo', 'documentation')
        }),
        ('Administrative', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def save_model(self, request, obj, form, change):
        if not change:  # If creating new borehole
            obj.created_by = request.user
        super().save_model(request, obj, form, change)