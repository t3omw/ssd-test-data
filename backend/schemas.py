from pydantic import BaseModel, Field, field_validator

class SSDLogCreate(BaseModel):
    serial_number: str = Field(..., min_length=1)
    controller: str = Field(..., min_length=1)
    firmware: str = Field(..., min_length=1)
    test_status: str = Field(..., pattern="^(Pass|Fail|Warning)$")
    temperature: float = Field(..., ge=-40, le=125)

    @field_validator('serial_number', 'controller', 'firmware')
    @classmethod
    def not_empty(cls, v: str):
        if not v.strip():
            raise ValueError('Field cannot be empty')
        return v