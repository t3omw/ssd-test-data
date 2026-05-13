from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
from zoneinfo import ZoneInfo
import models
import database
import schemas

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
models.Base.metadata.create_all(bind=database.engine)

@app.post("/logs")
def create_log(log_input: schemas.SSDLogCreate, db: Session = Depends(database.get_db)):
    malaysia_tz = ZoneInfo("Asia/Kuala_Lumpur")
    
    new_log = models.SSDTestLog(
        serial_number=log_input.serial_number,
        controller=log_input.controller,
        firmware=log_input.firmware,
        test_status=log_input.test_status,
        temperature=log_input.temperature,
        timestamp=datetime.now(malaysia_tz)
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log

@app.get("/logs")
def get_logs(db: Session = Depends(database.get_db)):
    return db.query(models.SSDTestLog).order_by(models.SSDTestLog.timestamp.desc()).all()

@app.delete("/logs/{log_id}")
def delete_log(log_id: int, db: Session = Depends(database.get_db)):
    db_log = db.query(models.SSDTestLog).filter(models.SSDTestLog.id == log_id).first()
    if not db_log:
        raise HTTPException(status_code=404, detail="Log not found")
    db.delete(db_log)
    db.commit()
    return {"message": "Deleted"}