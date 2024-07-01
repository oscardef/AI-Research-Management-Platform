# app/utils/auth.py

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from app.utils.supabase_client import supabase

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    user = supabase.auth.get_user(token)
    if user.user is None:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    return user.user
