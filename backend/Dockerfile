# Use Python 3.12
FROM python:3.12-slim

# Install system dependencies for PostgreSQL (psycopg2)
RUN apt-get update && apt-get install -y libpq-dev gcc

# Set work directory
WORKDIR /app

# Copy requirements and install
# Note: You need a requirements.txt file in your backend folder
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the code
COPY . .

# Command to run the API
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]