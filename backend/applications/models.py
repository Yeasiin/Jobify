from django.db import models

class Application(models.Model):
    resume = models.FileField(upload_to='uploads/')
    cover_later =  models.TextField()
    experience =  models.CharField(max_length=100)
    expected_salary =  models.CharField(max_length=100)
    link = models.CharField(max_length=100)
    applied_at = models.DateTimeField(auto_now_add=True)
    