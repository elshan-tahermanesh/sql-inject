FROM python:3.11-slim

WORKDIR /app

# Copy python packages file
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend files
COPY . .

EXPOSE 5000

# Start Flask backend via runner script
CMD ["python", "run.py"]
