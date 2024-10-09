## STAGE 1: Build the React frontend
FROM node:20.9.0-alpine as frontend-builder

# Sets and creates the working directory inside the container to /app/frontend
WORKDIR /app/frontend

# Copy the package.json and package-lock.json for the frontend
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm install

# Copy all frontend source code to the working directory
COPY frontend ./

# Build the frontend (creates /app/frontend/dist)
RUN npm run build


## STAGE 2: Prepare the Python Flask backend
FROM python:3.12.7-slim

# Set the working directory for the backend
WORKDIR /app/backend

# Install backend dependencies via pip
RUN pip install gTTS flask flask-cors

# Copy all backend source code to the working directory
COPY backend ./

# Copy the built frontend files from the previous stage to the backend folder
# Serve these static files from Flask
COPY --from=frontend-builder /app/frontend/dist /app/backend/frontend/dist

# Expose the port Flask will run on
EXPOSE 8080

# Set the environment variable for Flask app
ENV FLASK_APP=server.py

# Run the Flask server
CMD ["flask", "run", "--host=0.0.0.0", "--port=8080"]
