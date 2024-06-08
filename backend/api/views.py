from rest_framework import viewsets
from .models import User, ResearchProject, ModelMetadata, Log
from .serializers import UserSerializer, ResearchProjectSerializer, ModelMetadataSerializer, LogSerializer
from django.http import JsonResponse

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ResearchProjectViewSet(viewsets.ModelViewSet):
    queryset = ResearchProject.objects.all()
    serializer_class = ResearchProjectSerializer

class ModelMetadataViewSet(viewsets.ModelViewSet):
    queryset = ModelMetadata.objects.all()
    serializer_class = ModelMetadataSerializer

class LogViewSet(viewsets.ModelViewSet):
    queryset = Log.objects.all()
    serializer_class = LogSerializer

def api_overview(request):
    return JsonResponse({"message": "Welcome to the AI Research Management Platform API!"})
