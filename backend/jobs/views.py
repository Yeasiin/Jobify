from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Job, Category
from .serializers import JobSerializer


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
        
    def get_permissions(self):
        if self.action in ['list','retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        
        return [permission() for permission in permission_classes]
    
    
class CategoryListAPIView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = Category
    
    def get_permissions(self):
        if self.action in ['list','retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        
        return [permission() for permission in permission_classes]