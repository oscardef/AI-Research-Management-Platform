from django.urls import path
from .views import api_overview, get_users, get_research_projects, get_model_metadata, get_logs, create_user, create_research_project, create_model_metadata, create_log

urlpatterns = [
    path('', api_overview, name='api_overview'),
    path('users/', get_users, name='get_users'),
    path('research_projects/', get_research_projects, name='get_research_projects'),
    path('model_metadata/', get_model_metadata, name='get_model_metadata'),
    path('logs/', get_logs, name='get_logs'),
    path('users/create/', create_user, name='create_user'),
    path('research_projects/create/', create_research_project, name='create_research_project'),
    path('model_metadata/create/', create_model_metadata, name='create_model_metadata'),
    path('logs/create/', create_log, name='create_log'),
]
