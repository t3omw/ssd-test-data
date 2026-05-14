from sqlalchemy import Column, Integer, String, Float, DateTime
import datetime
from database import Base

class SSDTestLog(Base):
    __tablename__ = "test_logs"
    id = Column(Integer, primary_key=True, index=True)
    serial_number = Column(String, index=True)
    controller = Column(String)  # e.g., PS5026-E26
    firmware = Column(String)
    test_status = Column(String) # Pass/Fail
    temperature = Column(Float)
    timestamp = Column(DateTime(timezone=True))
    ai_status = Column(String, nullable=True)