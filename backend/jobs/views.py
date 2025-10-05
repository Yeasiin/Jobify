from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Job, Category
from .serializers import JobSerializer, CategorySerializer
from .permissions import IsEmployeeOrReadOnly

class JobViewSet(viewsets.ModelViewSet):
    # queryset = Job.objects.all()
    serializer_class  = JobSerializer
    permission_classes = [IsEmployeeOrReadOnly]
    
    def get_queryset(self):
        queryset=Job.objects.all()
        user = self.request.user
        mine = self.request.query_params.get("mine")  
        category_name = self.request.query_params.get('category')
        
        
        if mine=='true':
            if not  user.is_authenticated:
                return Job.objects.none()
            
            queryset = queryset.filter(created_by=user)
            
        if category_name:
            queryset = queryset.filter(category__name__iexact=category_name)
            
        return queryset.order_by('-created_at')
    
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request']=self.request
        return context  
        
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance_id = instance.id  # store id before deleting
        self.perform_destroy(instance)
        return Response(
            {"message": "Job deleted successfully", "id": instance_id},
            status=status.HTTP_200_OK
        )
        
    
    
class CategoryListAPIView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny] 
    pagination_class= None