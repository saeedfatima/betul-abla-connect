from django.contrib import admin
from django.utils import timezone
from .models import Report

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('title', 'report_type', 'status', 'created_by', 'created_at', 'published_at')
    list_filter = ('report_type', 'status', 'created_at', 'published_at')
    search_fields = ('title', 'content', 'created_by__username')
    list_editable = ('status',)
    readonly_fields = ('created_at', 'updated_at', 'file_url')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'report_type', 'content', 'status')
        }),
        ('Relationships', {
            'fields': ('orphan', 'borehole'),
            'classes': ('collapse',)
        }),
        ('File Attachment', {
            'fields': ('file_attachment', 'file_url'),
            'classes': ('collapse',)
        }),
        ('Review Process', {
            'fields': ('reviewed_by', 'published_at')
        }),
        ('Administrative', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    actions = ['publish_reports', 'archive_reports']
    
    def save_model(self, request, obj, form, change):
        if not change:  # If creating new report
            obj.created_by = request.user
        
        # Auto-set published_at when status changes to published
        if obj.status == 'published' and not obj.published_at:
            obj.published_at = timezone.now()
            
        super().save_model(request, obj, form, change)
    
    def publish_reports(self, request, queryset):
        updated = queryset.filter(status__in=['draft', 'review', 'approved']).update(
            status='published',
            published_at=timezone.now()
        )
        self.message_user(request, f'{updated} reports were successfully published.')
    publish_reports.short_description = 'Publish selected reports'
    
    def archive_reports(self, request, queryset):
        updated = queryset.update(status='archived')
        self.message_user(request, f'{updated} reports were archived.')
    archive_reports.short_description = 'Archive selected reports'