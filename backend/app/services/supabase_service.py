from supabase import create_client, Client
from app.utils.config import settings
from fastapi import APIRouter, Depends, HTTPException
import logging

supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
logging.basicConfig(level=logging.INFO)

log = logging.getLogger(__name__)


class SupabaseService:
    @staticmethod
    def get_models(user_id: str):
        response = supabase.from_("models").select("*").eq("user_id", user_id).execute()
        log.info(f"Get models response: {response}")
        if response.data:
            return response.data
        return None

    @staticmethod
    def create_model(model_data: dict):
        response = supabase.from_("models").insert(model_data).execute()
        log.info(f"Create model response: {response}")
        if response.data:
            return response.data
        else:
            log.error(f"Error creating model: {response}")
            return None

    @staticmethod
    def upload_file(user_id: str, file_name: str, file_contents: bytes) -> str:
        # Create the full file path with user ID as folder
        full_file_path = f"{user_id}/{file_name}"
        
        # Perform the file upload
        response = supabase.storage.from_("model-files").upload(full_file_path, file_contents)
        if response.error:
            log.error(f"Error uploading file: {response.error}")
            raise HTTPException(status_code=500, detail="Error uploading file")

        # Return the public URL of the uploaded file
        return supabase.storage.from_("model-files").get_public_url(full_file_path)['publicURL']


    @staticmethod
    def delete_model(model_id: int, user_id: str):
        log.info(f"Attempting to delete model with ID: {model_id} for user ID: '{user_id}'")
        response = supabase.table('models').delete().eq('id', model_id).eq('user_id', user_id).execute()
        log.info(f"Delete model response: {response}")
        log.info(f"Response data: {response.data}")
        if response.data:  # Check if data is returned (successful deletion)
            return True
        return False



supabase_service = SupabaseService()
