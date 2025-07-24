from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator

User = get_user_model()

class Borehole(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('maintenance', 'Under Maintenance'),
        ('inactive', 'Inactive'),
        ('planned', 'Planned'),
    ]
    
    WATER_QUALITY_CHOICES = [
        ('excellent', 'Excellent'),
        ('good', 'Good'),
        ('fair', 'Fair'),
        ('poor', 'Poor'),
        ('untested', 'Not Tested'),
    ]

    # Basic Information
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=200)
    community_served = models.CharField(max_length=100, blank=True)
    
    # Geographic Information
    latitude = models.DecimalField(max_digits=10, decimal_places=8, blank=True, null=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=8, blank=True, null=True)
    
    # Technical Details
    depth_meters = models.PositiveIntegerField(
        blank=True, null=True,
        validators=[MinValueValidator(1), MaxValueValidator(1000)]
    )
    water_quality = models.CharField(max_length=20, choices=WATER_QUALITY_CHOICES, default='untested')
    
    # Operational Information
    installation_date = models.DateField(blank=True, null=True)
    last_maintenance = models.DateField(blank=True, null=True)
    beneficiaries_count = models.PositiveIntegerField(default=0)
    
    # Status and Management
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planned')
    created_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name='created_boreholes')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'boreholes'
        ordering = ['-created_at']
        verbose_name = 'Borehole'
        verbose_name_plural = 'Boreholes'
        
    def __str__(self):
        return f"{self.name} - {self.location}"
    
    @property
    def coordinates(self):
        if self.latitude and self.longitude:
            return {'latitude': float(self.latitude), 'longitude': float(self.longitude)}
        return None