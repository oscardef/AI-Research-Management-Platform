from app.utils.config import settings
import ubiops

class UbiOpsService:
    def __init__(self):
        self.client = ubiops.ApiClient(
            ubiops.Configuration(
                api_key={'Authorization': settings.ubiops_api_token},
                host='https://api.ubiops.com/v2.1'
            )
        )
        self.api = ubiops.CoreApi(self.client)
