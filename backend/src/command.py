from pydantic import BaseModel

class Command(BaseModel):
    topic: str
    payload: str
