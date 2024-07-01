# app/schemas/models.py

from pydantic import BaseModel
from typing import Optional

class ModelBase(BaseModel):
    name: str
    description: Optional[str] = None
    version: str
    performance_metrics: str

class ModelCreate(ModelBase):
    pass

class ModelResponse(ModelBase):
    id: int
    user_id: str
