from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.responses import StreamingResponse
from sqlalchemy import text 
from datetime import datetime
from zoneinfo import ZoneInfo
import models
import database
import schemas
import io
import csv

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

from sqlalchemy import text # Add this import at the top

@app.get("/health")
def health_check(db: Session = Depends(database.get_db)):
    try:
        # Fixed syntax for SQLAlchemy 2.0
        db.execute(text("SELECT 1"))
        return {"status": "Online", "database": "Connected", "version": "1.0.4-stable"}
    except Exception as e:
        print(f"Health check failed: {e}")
        raise HTTPException(status_code=500, detail="Database Offline")

@app.post("/logs")
def create_log(log_input: schemas.SSDLogCreate, db: Session = Depends(database.get_db)):
    malaysia_tz = ZoneInfo("Asia/Kuala_Lumpur")
    
    # Calculate AI prediction
    ai_prediction = "Predictive" if log_input.temperature > 80 else "Normal"

    new_log = models.SSDTestLog(
        serial_number=log_input.serial_number,
        controller=log_input.controller,
        firmware=log_input.firmware,
        test_status=log_input.test_status,
        temperature=log_input.temperature,
        timestamp=datetime.now(malaysia_tz),
        ai_status=ai_prediction # This will work now!
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

@app.get("/logs/export")
def export_logs(db: Session = Depends(database.get_db)):
    # 1. Fetch all logs
    logs = db.query(models.SSDTestLog).order_by(models.SSDTestLog.timestamp.desc()).all()
    
    # 2. Create the CSV data in a string buffer
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write Header
    writer.writerow(["ID", "Timestamp (MYT)", "Serial Number", "Controller", "Firmware", "Temp (°C)", "Status"])
    
    # Write Data
    for log in logs:
        # Format the timestamp for Excel readability
        formatted_time = log.timestamp.strftime("%Y-%m-%d %H:%M:%S") if log.timestamp else "N/A"
        
        writer.writerow([
            log.id, 
            formatted_time,
            log.serial_number, 
            log.controller, 
            log.firmware, 
            f"{log.temperature}", 
            log.test_status
        ])
    
    # 3. FIX: StreamingResponse needs an iterator. 
    # We use getvalue() to get the string and wrap it in an iterator.
    csv_content = output.getvalue()
    output.close() # Clean up memory
    
    return StreamingResponse(
        iter([csv_content]), # Wrap the string in an iterator
        media_type="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=ssd_test_logs.csv",
            "Content-Type": "text/csv; charset=utf-8"
        }
    )