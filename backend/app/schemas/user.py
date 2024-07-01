# app/schemas/user.py

from pydantic import BaseModel

class User(BaseModel):
    id: str
    email: str
    phone: str = None
    role: str = None
    is_anonymous: bool = False
