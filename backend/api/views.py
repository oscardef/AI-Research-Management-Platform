from supabase import create_client, Client
from django.http import JsonResponse, HttpResponse
import os
from dotenv import load_dotenv
import json

# Load environment variables from .env file
load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def api_overview(request):
    return JsonResponse({"message": "Welcome to the AI Research Management Platform API!"})

def get_users(request):
    try:
        response = supabase.table('users').select('*').execute()
        return JsonResponse(response.data, safe=False)
    except Exception as e:
        return HttpResponse(status=500, content=str(e))

def get_research_projects(request):
    try:
        response = supabase.table('research_projects').select('*').execute()
        return JsonResponse(response.data, safe=False)
    except Exception as e:
        return HttpResponse(status=500, content=str(e))

def get_model_metadata(request):
    try:
        response = supabase.table('model_metadata').select('*').execute()
        return JsonResponse(response.data, safe=False)
    except Exception as e:
        return HttpResponse(status=500, content=str(e))

def get_logs(request):
    try:
        response = supabase.table('logs').select('*').execute()
        return JsonResponse(response.data, safe=False)
    except Exception as e:
        return HttpResponse(status=500, content=str(e))

def create_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            response = supabase.table('users').insert(data).execute()
            return JsonResponse(response.data, safe=False)
        except Exception as e:
            return HttpResponse(status=500, content=str(e))

def create_research_project(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            response = supabase.table('research_projects').insert(data).execute()
            return JsonResponse(response.data, safe=False)
        except Exception as e:
            return HttpResponse(status=500, content=str(e))

def create_model_metadata(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            response = supabase.table('model_metadata').insert(data).execute()
            return JsonResponse(response.data, safe=False)
        except Exception as e:
            return HttpResponse(status=500, content=str(e))

def create_log(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            response = supabase.table('logs').insert(data).execute()
            return JsonResponse(response.data, safe=False)
        except Exception as e:
            return HttpResponse(status=500, content=str(e))
