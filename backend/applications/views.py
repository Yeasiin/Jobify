from django.shortcuts import render
from rest_framework import viewsets, parsers
from .models import Application
from .serializers import ApplicationSerializer

class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    parser_classes = (parsers.MultiPartParser, parsers.FileUploadParser,)
    
