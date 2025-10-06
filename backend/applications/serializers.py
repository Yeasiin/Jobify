from rest_framework import serializers
from .models import Application
from jobs.serializers import JobSerializer
from django.contrib.auth import get_user_model
from jobs.models import Job

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email']  # adjust fields as needed
class ApplicationSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)
    user = UserSerializer(read_only=True) 
    job_id = serializers.PrimaryKeyRelatedField( queryset=Job.objects.all(), write_only=True, source='job')
    
    class Meta:
        model = Application
        # fields = '__all__'
        exclude = []
        # exclude = ['user']
        
    def validate(self, attrs):
        
        user = self.context['request'].user
        job = attrs['job']
        
        if Application.objects.filter(user=user, job=job).exists():
            raise serializers.ValidationError('You have already applied to this job.')
        
        return attrs
    
    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        
        return super().create(validated_data)