from pydantic import BaseModel

class User(BaseModel):
    id: int
    username: str
    email: str
    # Add other fields as necessary
