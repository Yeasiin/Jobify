from rest_framework import serializers
from .models import Job, Category


class JobSerializer(serializers.ModelSerializer):
    created_by = serializers.SerializerMethodField()
    category = serializers.SlugRelatedField(queryset = Category.objects.all(), slug_field='name',allow_null=True)
    class Meta:
        model = Job
        fields = '__all__'
        
    def get_created_by_name(self,obj):
        return obj.created_by.first_name if obj.created_by else 'Deleted User'
        
        
class CategorySerializer(serializers.ModelSerializer):
    class Meta: 
        model = Category
        fields = ['id', 'name']