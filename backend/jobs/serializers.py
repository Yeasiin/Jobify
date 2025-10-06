from rest_framework import serializers
from .models import Job, Category


class JobSerializer(serializers.ModelSerializer):
    created_by_name = serializers.SerializerMethodField()
    category = serializers.SlugRelatedField(queryset = Category.objects.all(), slug_field='name',allow_null=True)
    
    applications_count =  serializers.SerializerMethodField()
    applied = serializers.SerializerMethodField()
    
    class Meta:
        model = Job
        fields = [
            "id",
            "title",
            "company_name",
            "description",
            "requirements",
            "location",
            "category",
            "created_at",
            "created_by_name",
            "applications_count","applied"
            ]
        read_only_fields = ["created_at", "created_by_name","applications_count","applied"]
        
    def get_created_by_name(self, obj):
        return obj.created_by.first_name if obj.created_by else "Deleted User"
    
    def get_applications_count(self, obj):
        return obj.applications.count()
    
    def get_applied(self, obj):
        request =   self.context.get('request')
        
        if request and request.user.is_authenticated:
            return obj.applications.filter(user=request.user).exists()
        
        return False
    

    def create(self, validated_data):
        request = self.context.get("request")
        if request and hasattr(request, "user") and request.user.is_authenticated:
            validated_data["created_by"] = request.user
        return super().create(validated_data)
        
        
class CategorySerializer(serializers.ModelSerializer):
    class Meta: 
        model = Category
        fields = ['id', 'name']