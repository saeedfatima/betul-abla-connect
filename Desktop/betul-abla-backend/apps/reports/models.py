from django.db import models
from django.contrib.auth import get_user_model
from apps.orphans.models import Orphan
from apps.boreholes.models import Borehole

User = get_user_model()

class Report(models.Model):
    REPORT_TYPES = [
        ('monthly', 'Monthly Report'),
        ('quarterly', 'Quarterly Report'),
        ('annual', 'Annual Report'),
        ('incident', 'Incident Report'),
        ('maintenance', 'Maintenance Report'),
        ('financial', 'Financial Report'),
        ('assessment', 'Assessment Report'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('review', 'Under Review'),
        ('approved', 'Approved'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]

    # Basic Information
    title = models.CharField(max_length=200)
    report_type = models.CharField(max_length=20, choices=REPORT_TYPES)
    content = models.TextField()
    
    # Relationships
    orphan = models.ForeignKey(Orphan, on_delete=models.CASCADE, blank=True, null=True, related_name='reports')
    borehole = models.ForeignKey(Borehole, on_delete=models.CASCADE, blank=True, null=True, related_name='reports')
    
    # File attachments
    file_attachment = models.FileField(upload_to='reports/attachments/', blank=True, null=True)
    
    # Administrative
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    created_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name='created_reports')
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True, related_name='reviewed_reports')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        db_table = 'reports'
        ordering = ['-created_at']
        verbose_name = 'Report'
        verbose_name_plural = 'Reports'
        
    def __str__(self):
        return f"{self.title} - {self.get_report_type_display()}"
    
    @property
    def file_url(self):
        if self.file_attachment:
            return self.file_attachment.url
        return None