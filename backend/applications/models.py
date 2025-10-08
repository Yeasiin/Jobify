from django.db import models
from django.contrib.auth import get_user_model
from jobs.models import Job

import os
from django.db.models.signals import pre_delete
from django.dispatch import  receiver



User = get_user_model()
class Application(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('reviewing', 'Reviewing'),
        ('shortlisted', 'Shortlisted'),
        ('rejected', 'Rejected'),
        ('accepted', 'Accepted'),
    ]
    
    resume = models.FileField(upload_to='uploads/',blank=True)
    cover_letter =  models.TextField(blank=True)
    experience =  models.CharField(max_length=100,blank=True)
    expected_salary =  models.CharField(max_length=100,blank=True)
    link = models.CharField(max_length=100,blank=True)
    
    job = models.ForeignKey(Job, on_delete=models.CASCADE,related_name='applications')
    
    user = models.ForeignKey(User,on_delete=models.SET_NULL,null=True,related_name='applications')
    applied_at = models.DateTimeField(auto_now_add=True)
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    
    class Meta:
        unique_together = ('job', 'user')

    def __str__(self):
        return f'Application for "{self.job.title}" by {self.user.first_name if self.user else "Deleted User"}'
    
    
# 
@receiver(pre_delete, sender=User)
def anonymize_user_data(sender,instance,**kwargs):
    applications = instance.applications.all()
    
    for app in applications:
        if app.resume:
            if os.path.isfile(app.resume.path):
                os.remove(app.resume.path)
                
        app.is_deleted = True
        app.user = None
        app.save()