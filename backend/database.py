from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@db:5432/maistorage")
# Use localhost when running on Windows, use 'db' when running in Docker
# DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/maistorage")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal() # Borrow connection fromt the pool
    try:
        yield db  # Give connection to FastAPI
    finally:
        db.close()  # Return connection to the pool