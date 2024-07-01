# app/utils/supabase_client.py

from supabase import create_client, Client
from app.utils.config import settings

supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
