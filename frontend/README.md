SSD Test Data Consolidation Portal

🚀 Overview

This project is a full-stack data management system designed for semiconductor
testing environments. It allows engineers to input SSD test results (Serial
Numbers, Controller types, Temperatures, etc.), which are then automatically
consolidated into a centralized PostgreSQL database with built-in validation and
localized time-stamping for the Malaysia region.

Key Features

  - Real-time Data Consolidation: Synchronized pipeline between React and
    PostgreSQL via a FastAPI REST layer.
  - Hardware-Aware Validation: Implements strict data integrity rules using
    Pydantic (e.g., temperature limits of -40°C to 125°C).
  - Advanced Filtering: Instant client-side search and category filtering for
    high-volume log analysis.
  - Localized Timing: Automated timestamping synced to the Asia/Kuala_Lumpur
    (MYT) timezone.
  - Containerized Architecture: Fully dockerized stack for seamless deployment
    and reproducibility.

🛠 Tech Stack

  - Frontend: React.js, Lucide-React (Icons), CSS3
  - Backend: Python 3.12, FastAPI, SQLAlchemy (ORM), Pydantic (Validation)
  - Database: PostgreSQL 15
  - Infrastructure: Docker, Docker Compose

📦 Setup & Execution

Option A: The "One-Click" Docker Way (Recommended)

This method spins up the entire stack (Frontend, Backend, and Database)
automatically. Ensure Docker Desktop is running.

1.  Open your terminal in the root folder.
2.  Run the following command:
    docker-compose up --build
3.  Access the portal:
      - Frontend: http://localhost:3000
      - Interactive API Docs: http://localhost:8000/docs

Option B: Local Manual Setup (Development Mode)

If you wish to run the components individually outside of Docker:

1. Database

Ensure a PostgreSQL instance is running on localhost:5432 and create a database
named maistorage.

2. Backend (FastAPI)

1.  Navigate to the backend folder:
    cd backend
2.  Create and activate a Virtual Environment:
    py -m venv venv
    .\venv\Scripts\activate
3.  Install dependencies:
    pip install -r requirements.txt
4.  Start the server:
    uvicorn main:app --reload

3. Frontend (React)

1.  Navigate to the frontend folder:
    cd frontend
2.  Install dependencies:
    npm install
3.  Start the application:
    npm start

📐 Design Decisions

1. Data Integrity & Validation

Using Pydantic schemas, the backend rejects invalid data before it reaches the
database. This is critical in semiconductor manufacturing where "dirty data" can
lead to incorrect failure analysis. We enforce strict ranges for operating
temperatures and mandatory fields for SSD tracking.

2. Timezone Management

Since MaiStorage operates in Malaysia, the system was configured to override the
default UTC server time. By utilizing zoneinfo and tzdata, every record is
stamped with a precise Malaysia (MYT) timestamp to ensure accurate log
sequencing.

3. Relational Database (PostgreSQL)

PostgreSQL was chosen over NoSQL alternatives to ensure ACID compliance. Given
that test logs are highly structured and require strict traceability, a
relational schema ensures that SSD records are never orphaned or corrupted.

4. User Experience (UX) for Engineers

  - Search & Filter: Designed for "Power Users" who need to find specific
    batches or controllers (e.g., PS5026-E26) across thousands of records.
  - Clean UI: Minimized visual noise and removed browser-default "blue frame"
    effects for a professional, focused engineering tool.

🧪 API Endpoints

  - POST /logs: Validate and consolidate new test data to the DB.
  - GET /logs: Retrieve all consolidated logs (Sorted by newest).
  - DELETE /logs/{id}: Securely remove a specific test record.

Developed for the MaiStorage Technical Assessment - May 2026
