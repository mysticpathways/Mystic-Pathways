# Mystic Pathways Backend Setup

## Prerequisites
- Node.js and npm installed
- MongoDB installed and running locally (default: mongodb://localhost:27017/mysticpathways)

## Install dependencies
Open PowerShell in the backend folder and run:

npm install

## Start the server
node server.js

## API Endpoints
- POST /api/register: Register a new user
- POST /api/login: Login
- GET /api/reviews: Get all reviews
- POST /api/reviews: Add a review
- GET /api/services: Get all services
- POST /api/services: Add a service
- GET /api/places: Get all places
- POST /api/places: Add a place

## Notes
- Passwords are hashed using bcrypt
- You can connect your frontend forms using fetch/AJAX to these endpoints
- For production, use environment variables for DB connection and secure authentication
