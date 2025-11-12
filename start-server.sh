#!/bin/bash

echo "========================================"
echo "  Meiosis Explorer - Starting Server"
echo "========================================"
echo ""

# Check if Node.js is installed
if command -v node &> /dev/null
then
    echo "Starting Node.js Server..."
    echo "Server will run at: http://localhost:3000"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    node server.js
elif command -v python3 &> /dev/null
then
    echo "Node.js not found. Starting Python HTTP Server..."
    echo "Server will run at: http://localhost:8000"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    python3 -m http.server 8000
elif command -v python &> /dev/null
then
    echo "Node.js not found. Starting Python HTTP Server..."
    echo "Server will run at: http://localhost:8000"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    python -m http.server 8000
else
    echo "❌ Neither Node.js nor Python found!"
    echo ""
    echo "Please install Node.js or Python to run the server."
    echo "Alternatively, just open index.html directly in your browser."
    echo ""
    read -p "Press enter to exit..."
fi

