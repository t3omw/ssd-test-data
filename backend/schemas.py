from pydantic import BaseModel, Field, field_validator
from datetime import datetime

class SSDLogCreate(BaseModel):
    serial_number: str = Field(..., min_length=1)
    controller: str = Field(..., min_length=1)

    firmware: float = Field(..., gt=0, description="Firmware must be a positive numerical value")
    
    test_status: str = Field(..., pattern="^(Pass|Fail|Warning)$")
    temperature: float = Field(..., ge=-40, le=125)

    @field_validator('serial_number', 'controller')
    @classmethod
    def not_empty(cls, v: str):
        if not v.strip():
            raise ValueError('Field cannot be empty')
        return v

# Schema for outgoing data (GET/Response)
class SSDLogResponse(SSDLogCreate):
    id: int
    timestamp: datetime
    ai_status: str 
    class Config:
        from_attributes = True