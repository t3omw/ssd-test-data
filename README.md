SSD Test Data Consolidation Portal

🚀 Overview

This project is a high-performance, full-stack data management system tailored
for semiconductor testing environments. It enables engineers to input SSD test
results (Serial Numbers, Controller models, Temperatures, etc.), which are
automatically consolidated into a centralized PostgreSQL database.

The system features Production-Grade containerization, Hardware-Aware
validation, and Localized Time-Stamping specifically optimized for operations in
the Malaysia region.

🌟 Key Technical Features

  - Automatic Data Consolidation: Seamless pipeline synchronizing React frontend
    data to a persistent PostgreSQL state via FastAPI.
  - Intelligent Insights: Built-in heuristic engine that flags records for
    Predictive Maintenance based on thermal thresholds.
  - Data Integrity (Pydantic): Strict backend validation preventing "dirty data"
    (e.g., negative firmware versions or out-of-range temperatures).
  - Localized Sequencing: Automated timestamping synced to Asia/Kuala_Lumpur
    (MYT) for accurate lab log synchronization.
  - Production Ghosting: Frontend deployed via Nginx Alpine to simulate a
    production "Ghost" image deployment.

🛠 Tech Stack

  - Frontend: React.js, Lucide-React (Icons), CSS3 (Nginx Production Build)
  - Backend: Python 3.12, FastAPI, SQLAlchemy (ORM), Pydantic v2
  - Database: PostgreSQL 15 (Alpine)
  - Orchestration: Docker & Docker Compose

🐋 Container & Image Management

To align with the focus on Image Pulling and Ghosting, this project utilizes
optimized container strategies:

1. Multi-Stage Build Optimization

The application uses multi-stage Dockerfiles to separate the build environment
from the runtime environment.

  - Frontend Optimization: Reduced image size from ~770MB (development) to <30MB
    (production assets) by ghosting static files into an Nginx Alpine container.
  - Benefit: Facilitates rapid Image Pulling across internal lab networks and
    reduces disk footprint on test stations.

2. Operational Commands

Use these commands to manage the container lifecycle:

| Action                  | Command                          |
| :---------------------- | :------------------------------- |
| **Deploy Stack**        | `docker-compose up --build -d`   |
| **View Health Logs**    | `docker-compose logs -f backend` |
| **Check Image Sizes**   | `docker images`                  |
| **Verify Connectivity** | `docker-compose ps`              |
| **Clean Reset**         | `docker-compose down -v`         |

📦 Setup & Execution

Option A: The "One-Click" Docker Way (Recommended)

Ensures full environment parity (Ghosting) across all systems.

1.  Ensure Docker Desktop is running.
2.  Open terminal in the root folder and run:
    docker-compose up --build
3.  Access the Portal:
      - Frontend: http://localhost:3000
      - API Documentation: http://localhost:8000/docs

Option B: Local Manual Setup (Development Mode)

1. Database

docker-compose up -d db

2. Backend (FastAPI)

cd backend
py -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

3. Frontend (React)

cd frontend
npm install
npm start

📐 Design Decisions

1. Hardware-Aware Integrity

In semiconductor manufacturing, data accuracy is paramount. I implemented
Pydantic field validators to reject invalid firmware strings and enforce
realistic thermal operating ranges (-40°C to 125°C) before data reaches the
persistence layer.

2. Relational Stability (PostgreSQL)

PostgreSQL was chosen over NoSQL to ensure ACID compliance. Test logs are
relational by nature; using a structured schema ensures that SSD records
maintain strict traceability for future failure analysis.

3. Observability & Health Monitoring

A real-time System Status Bar is integrated into the UI. It polls a dedicated
/health endpoint that performs a heartbeat check on the database connection,
ensuring engineers know the "Consolidation" pipeline is active.

4. Professional UX for Engineers

  - Advanced Filtering: Multi-criteria search (Serial, Controller, Status)
    designed for navigating thousands of records.
  - One-Click Export: Native CSV streaming for immediate data analysis in
    Excel/MATLAB.

🧪 API Endpoints

  - POST /logs: Validate and consolidate data to the Master DB.
  - GET /logs: Retrieve all consolidated records (Sorted by newest).
  - DELETE /logs/{id}: Securely remove a specific record.
  - GET /logs/export: Stream the database content to a CSV file.
  - GET /health: Monitor API and Database connectivity status.

Developed for the MaiStorage Technical Assessment — May 2026
