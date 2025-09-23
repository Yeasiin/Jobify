from django.db import models
from django.contrib.auth import get_user_model


User = get_user_model()

# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    
    def __str__(self):
        return self.name
    
    
class Job(models.Model):
    title = models.CharField(max_length=100)
    company_name = models.CharField(max_length=100)
    description = models.TextField()
    requirements =  models.TextField()
    location = models.CharField(max_length=100)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL,null=True, blank=True,related_name='jobs')
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL,  related_name='job_posts')
    
    def __str__(self):
        return f'{self.title} X {self.company_name}'
    
    
