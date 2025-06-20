FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy code
COPY launch_swiggy.py .
COPY temp_data.json .

CMD ["python", "launch_swiggy.py"]
