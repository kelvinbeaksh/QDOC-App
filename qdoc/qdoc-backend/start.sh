#!/bin/bash

# Start Firebase emulator
pm2 start pm2-configs/firebase-emulator.json

# Wait for emulator to start (5 seconds)
echo "Waiting for Firebase emulator to start..."
sleep 5

# Start backend
pm2 start dist/index.js --name "qdoc-backend"

# Save PM2 process list
pm2 save

# Show status
echo "\nPM2 Processes:"
pm2 list
