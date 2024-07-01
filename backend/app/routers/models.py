# app/routers/models.py

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from typing import List
from app.schemas.models import ModelCreate, ModelResponse
from app.utils.auth import get_current_user
from app.services.supabase_service import supabase_service
import logging
import json

log = logging.getLogger(__name__)

router = APIRouter()


@router.get("/", response_model=List[ModelResponse])
async def read_models(current_user: dict = Depends(get_current_user)):
    models = supabase_service.get_models(current_user.id)
    if models:
        return models
    elif models is None:
        return []
    raise HTTPException(status_code=500, detail="Error fetching models")


@router.post("/", response_model=ModelResponse)
async def create_model(
    data: str = Form(...),
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    try:
        model_data = json.loads(data)
        model_data['user_id'] = current_user.id
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON data")

    # Read the file contents
    file_contents = await file.read()
    # Create the file name with the user's ID as a folder
    file_name = file.filename
    # Upload the file
    file_url = supabase_service.upload_file(current_user.id, file_name, file_contents)

    model_data['file_url'] = file_url

    # Create the model record in the database
    new_model = supabase_service.create_model(model_data)
    if new_model:
        return new_model[0]
    raise HTTPException(status_code=500, detail="Error creating model")


@router.delete("/{model_id}")
async def delete_model(model_id: int, current_user: dict = Depends(get_current_user)):
    result = supabase_service.delete_model(model_id, current_user.id)
    if result:
        return {"message": "Model deleted successfully"}
    raise HTTPException(status_code=500, detail="Error deleting model")
