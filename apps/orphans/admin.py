from django.contrib import admin
from .models import Orphan

@admin.register(Orphan)
class OrphanAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'age', 'gender', 'status', 'guardian_name', 'monthly_allowance', 'created_at')
    list_filter = ('status', 'gender', 'education_level', 'health_status', 'created_at')
    search_fields = ('full_name', 'guardian_name', 'guardian_phone', 'address', 'school_name')
    list_editable = ('status', 'monthly_allowance')
    readonly_fields = ('age', 'created_at', 'updated_at')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Personal Information', {
            'fields': ('full_name', 'date_of_birth', 'age', 'gender', 'address', 'photo')
        }),
        ('Guardian Information', {
            'fields': ('guardian_name', 'guardian_phone', 'guardian_relationship')
        }),
        ('Education & Health', {
            'fields': ('school_name', 'education_level', 'health_status', 'special_needs')
        }),
        ('Financial & Status', {
            'fields': ('monthly_allowance', 'last_payment_date', 'status')
        }),
        ('Administrative', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def save_model(self, request, obj, form, change):
        if not change:  # If creating new orphan
            obj.created_by = request.user
        super().save_model(request, obj, form, change)