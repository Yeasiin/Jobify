from django.shortcuts import render
from rest_framework import viewsets, parsers
from .models import Application
from .serializers import ApplicationSerializer
from jobs.models import Job

class ApplicationViewSet(viewsets.ModelViewSet):
    # queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    parser_classes = (parsers.MultiPartParser, parsers.FileUploadParser,)
    
    def get_queryset(self):
        user = self.request.user
        
        if not user.is_authenticated:
            return Application.objects.none()
        
        my_jobs = Job.objects.filter(created_by=user)
        
        if my_jobs.exists():
            return Application.objects.filter(job__in=my_jobs).select_related('job', 'user')
        else:
            return Application.objects.filter(user=user).select_related('job', 'user')
        
    
    def perform_create(self, serializer):
       
        serializer.save(user=self.request.user)
       
    
