from rest_framework import viewsets, status
from .models import Job
from .serializers import JobSerializer
from rest_framework.response import Response

# Create your views here.
class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class  = JobSerializer
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance_id = instance.id  # store id before deleting
        self.perform_destroy(instance)
        return Response(
            {"message": "Job deleted successfully", "id": instance_id},
            status=status.HTTP_200_OK
        )