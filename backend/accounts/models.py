from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    username = None  
    email = models.EmailField(unique=True)
    USER_TYPE_CHOICES = (
        ("employer", "Employer"),
        ("jobseeker", "Job Seeker"),
    )
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='jobseeker')
    
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
        
    def __str__(self):
        return self.email
    
    def save(self, *args, **kwargs):
        if not self.username:
            self.username = self.email
        super().save(*args, **kwargs)
