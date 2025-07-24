from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import RegexValidator

User = get_user_model()

class Orphan(models.Model):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('pending', 'Pending Review'),
        ('inactive', 'Inactive'),
        ('graduated', 'Graduated'),
    ]
    
    EDUCATION_LEVELS = [
        ('nursery', 'Nursery'),
        ('primary', 'Primary School'),
        ('secondary', 'Secondary School'),
        ('tertiary', 'College/University'),
        ('vocational', 'Vocational Training'),
        ('not_enrolled', 'Not Enrolled'),
    ]
    
    HEALTH_STATUS_CHOICES = [
        ('excellent', 'Excellent'),
        ('good', 'Good'),
        ('fair', 'Fair'),
        ('poor', 'Poor'),
        ('critical', 'Critical'),
    ]

    # Basic Information
    full_name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    
    # Contact & Location
    address = models.TextField()
    phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$')
    guardian_name = models.CharField(max_length=100, blank=True)
    guardian_phone = models.CharField(validators=[phone_regex], max_length=17, blank=True)
    
    # Education
    school_name = models.CharField(max_length=200, blank=True)
    education_level = models.CharField(max_length=20, choices=EDUCATION_LEVELS, default='primary')
    
    # Health
    health_status = models.CharField(max_length=20, choices=HEALTH_STATUS_CHOICES, default='good')
    special_needs = models.TextField(blank=True)
    
    # Financial Support
    monthly_allowance = models.DecimalField(max_digits=10, decimal_places=2, default=100.00)
    last_payment_date = models.DateField(blank=True, null=True)
    
    # Media
    photo = models.ImageField(upload_to='orphans/photos/', blank=True, null=True)
    
    # Administrative
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name='created_orphans')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'orphans'
        ordering = ['-created_at']
        verbose_name = 'Orphan'
        verbose_name_plural = 'Orphans'
        
    def __str__(self):
        return f"{self.full_name} - {self.get_status_display()}"
    
    @property
    def age(self):
        from datetime import date
        today = date.today()
        return today.year - self.date_of_birth.year - ((today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day))
    
    @property
    def photo_url(self):
        if self.photo:
            return self.photo.url
        return None