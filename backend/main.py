from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends, HTTPException
import models
import database

app = FastAPI()

# IMPORTANT: Allow React to talk to FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# This line creates the tables in Postgres automatically when you start the app
models.Base.metadata.create_all(bind=database.engine)

# 1. THE CONSOLIDATION ENDPOINT (Input Data)
@app.post("/logs")
def create_ssd_log(data: dict, db: Session = Depends(database.get_db)):
    # Create the database object
    new_log = models.SSDTestLog(
        serial_number=data.get("serial_number"),
        controller=data.get("controller"),
        firmware=data.get("firmware"),
        test_status=data.get("test_status"),
        temperature=data.get("temperature")
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return {"status": "success", "data": new_log}

# 2. THE VIEW ENDPOINT (Read Data)
@app.get("/logs")
def get_all_logs(db: Session = Depends(database.get_db)):
    # Fetch all logs from DB sorted by newest first
    return db.query(models.SSDTestLog).order_by(models.SSDTestLog.timestamp.desc()).all()

@app.delete("/logs/{log_id}")
def delete_log(log_id: int, db: Session = Depends(database.get_db)):
    db_log = db.query(models.SSDTestLog).filter(models.SSDTestLog.id == log_id).first()
    if db_log is None:
        raise HTTPException(status_code=404, detail="Log not found")
    db.delete(db_log)
    db.commit()
    return {"message": "Deleted"}