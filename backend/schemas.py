from pydantic import BaseModel, Field, field_validator
from datetime import datetime

class SSDLogCreate(BaseModel):
    serial_number: str = Field(..., min_length=1)
    controller: str = Field(..., min_length=1)
    firmware: str = Field(..., min_length=1)
    test_status: str = Field(..., pattern="^(Pass|Fail|Warning)$")
    temperature: float = Field(..., ge=-40, le=125)

    @field_validator('firmware')
    @classmethod
    def validate_firmware(cls, v: str):
        # Check if the user input looks like a negative number
        if v.strip().startswith('-'):
            raise ValueError('Firmware version cannot be negative')
        return v

    @field_validator('serial_number', 'controller')
    @classmethod
    def not_empty(cls, v: str):
        if not v.strip():
            raise ValueError('Field cannot be empty')
        return v

# ADD THIS: Schema for outgoing data (GET/Response)
class SSDLogResponse(SSDLogCreate):
    id: int
    timestamp: datetime # This will now show "2024-05-20T14:30:00"

    class Config:
        from_attributes = True