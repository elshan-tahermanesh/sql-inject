FROM python:3.11-slim

WORKDIR /app

# Copy requirements from backend subdirectory
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY backend/ .

EXPOSE 5000

CMD ["python", "run.py"]
