from django.contrib.auth.models import AbstractUser
from django.db import models
from .managers import CustomUserManager

class User(AbstractUser):
    username = None  
    email = models.EmailField(unique=True)
    USER_TYPE_CHOICES = (
        ("Employer", "Employer"),
        ("Job Seeker", "Job Seeker"),
    )
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='Job Seeker')
    
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
    
    objects = CustomUserManager()
        
    def __str__(self):
        return self.email
    
    def save(self, *args, **kwargs):
        if not self.username:
            self.username = self.email
        super().save(*args, **kwargs)
