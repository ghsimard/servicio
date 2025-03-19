#!/bin/bash

# Start the backend
echo "Starting backend server..."
cd backend
npm run start &
BACKEND_PID=$!

# Give the backend a moment to start
sleep 3

# Start the frontend
echo "Starting frontend dev server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "Test environment is running!"
echo "Backend available at: http://localhost:3005"
echo "Frontend available at: http://localhost:3000"
echo "Test UI available at: http://localhost:3000/test"
echo "Auth Test UI available at: http://localhost:3000/auth-test"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for Ctrl+C and then clean up
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait 