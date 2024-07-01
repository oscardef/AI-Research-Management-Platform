# app/routers/ubiops.py

from fastapi import APIRouter, HTTPException
from app.services.ubiops_service import UbiOpsService

router = APIRouter(
    prefix="/ubiops",
    tags=["ubiops"]
)

ubiops_service = UbiOpsService()

@router.post("/deploy")
async def deploy_model():
    try:
        return ubiops_service.deploy_model()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
