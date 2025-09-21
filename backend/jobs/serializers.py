from rest_framework import serializers
from .models import Job, Category


class JobSerializer(serializers.ModelSerializer):
    
    category = serializers.SlugRelatedField(queryset = Category.objects.all(), slug_field='name',allow_null=True)
    
    
    class Meta:
        model = Job
        fields = '__all__'
        
        
class CategorySerializer(serializers.ModelSerializer):
    class Meta: 
        model = Category
        fields = ['id', 'name']