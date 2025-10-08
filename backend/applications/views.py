from django.shortcuts import render
from rest_framework import viewsets, parsers,status
from .models import Application
from .serializers import ApplicationSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .serializers import JobSerializer
from rest_framework import status as drf_status


from jobs.models import Job

class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    parser_classes = (parsers.MultiPartParser, parsers.FileUploadParser,)
    permission_classes = [IsAuthenticated]
    http_method_names = ['post','get','patch']
    
    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Application.objects.none()
        
        my_jobs = Job.objects.filter(created_by=user)
        
        if my_jobs.exists():
            return Application.objects.filter(job__in=my_jobs).select_related('user')
        else:
            return Application.objects.filter(user=user).select_related('user')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
    @action(detail=False, methods=['get'], url_path='by-job')
    def get_applications_by_job(self, request):
        job_id = request.query_params.get('job_id')
        if not job_id:
            return Response({"detail": "job_id query parameter is required."}, status=400)

        job = get_object_or_404(Job, id=job_id)

        # Only job creator can view
        if job.created_by != request.user:
            return Response({"detail": "Not allowed."}, status=403)

        applications = job.applications.select_related('user').all()
        serializer = self.get_serializer(applications, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='applied_job')
    def my_applied_jobs(self, request):
        user = request.user
        applications = Application.objects.filter(user=user).select_related('job')
        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'], url_path='update-status',   parser_classes=[parsers.JSONParser])
    def update_status(self, request, pk=None):
        application = self.get_object()
        
        if application.job.created_by != request.user:
            return Response({'detail':'You cannot update this application\'s status.'},status=drf_status.HTTP_403_FORBIDDEN)
        
        new_status = request.data.get("status")
        valid_statuses = [choice[0] for choice in Application.STATUS_CHOICES]
        
        if new_status not in valid_statuses: 
            return Response({'detail':f'Invalid status. must be one of {valid_statuses}'}, status=400)
        
        application.status = new_status
        application.save()
        return Response({'detail':'Status updated successfully.', 'status':new_status})

    
    
 