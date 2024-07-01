# app/models/model.py

from pydantic import BaseModel

class Model(BaseModel):
    id: str
    user_id: str
    name: str
    description: str
    version: str
    performance_metrics: str
    file_url: str
    created_at: str
