from rest_framework import serializers
from dj_rest_auth.serializers import UserDetailsSerializer
from dj_rest_auth.registration.serializers import RegisterSerializer
from allauth.account.utils import setup_user_email
from allauth.account.adapter import get_adapter


from django.contrib.auth import get_user_model

User = get_user_model()

class CustomUserDetailsSerializer(UserDetailsSerializer):
    class Meta:
        model = User
        fields = (
            'pk', 'email', 'first_name', 'last_name', 'user_type')
        read_only_fields = ('pk', 'email')


class CustomRegisterSerializer(RegisterSerializer):
    username = None 
    USER_TYPE_CHOICES = [
        ("Employer", "Employer"),
        ("Job Seeker", "Job Seeker"),
    ]
    first_name = serializers.CharField(max_length=30, required=False)
    last_name = serializers.CharField(max_length=30, required=False)
    user_type = serializers.ChoiceField(choices=USER_TYPE_CHOICES, default='Job Seeker')
    
    def validate_email(self, value):
        value = value.lower()
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('This email is already registered.')
        return value
    
    
    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        data['first_name'] = self.validated_data.get('first_name', '')
        data['last_name'] = self.validated_data.get('last_name', '')
        data['user_type'] = self.validated_data.get('user_type', 'Job Seeker')
        return data

    def save(self, request):
        adapter = get_adapter()
        user = adapter.new_user(request)
        self.cleaned_data = self.get_cleaned_data()
        
        user.user_type = self.cleaned_data.get('user_type', 'Job Seeker')
        user.email = self.cleaned_data.get('email')
        user.first_name = self.cleaned_data.get('first_name', '')
        user.last_name = self.cleaned_data.get('last_name', '')
        
        adapter.save_user(request, user, self)
        setup_user_email(request, user, [])
        return user



