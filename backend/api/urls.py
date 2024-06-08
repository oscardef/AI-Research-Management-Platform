from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import UserViewSet, ResearchProjectViewSet, ModelMetadataViewSet, LogViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'research-projects', ResearchProjectViewSet)
router.register(r'models', ModelMetadataViewSet)
router.register(r'logs', LogViewSet)

urlpatterns = [
    path('api/', views.api_overview, name='api-overview')
]
