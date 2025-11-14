/**
 * ============================================================================
 * MEIOSIS EXPLORER - HTTP SERVER
 * ============================================================================
 * Simple Node.js HTTP server to serve the Meiosis Explorer application
 * 
 * Purpose: Provides a local development server with proper MIME types
 * Run with: node server.js
 * Access at: http://localhost:3000
 * ============================================================================
 */

// ============================================================================
// MODULE IMPORTS
// ============================================================================
const http = require('http');
const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURATION
// ============================================================================
const PORT = 3000;

// ============================================================================
// MIME TYPE MAPPINGS
// Maps file extensions to their proper MIME types for correct browser rendering
// ============================================================================
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
};

// ============================================================================
// HTTP SERVER CREATION
// Handles incoming requests and serves files with appropriate MIME types
// ============================================================================
const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    // ========================================
    // REQUEST ROUTING
    // ========================================
    
    // Default to index.html for root path
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    // ========================================
    // CONTENT TYPE DETERMINATION
    // ========================================
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    // ========================================
    // FILE SERVING & ERROR HANDLING
    // ========================================
    fs.readFile(filePath, (error, content) => {
        if (error) {
            // Handle file not found errors
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - File Not Found</h1>', 'utf-8');
            } 
            // Handle other server errors
            else {
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`, 'utf-8');
            }
        } 
        // Successfully serve the file
        else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// ============================================================================
// SERVER INITIALIZATION
// Start listening on the specified port and display connection info
// ============================================================================
server.listen(PORT, () => {
    console.log('🧬 Meiosis Explorer Server Running!');
    console.log(`📡 Server: http://localhost:${PORT}`);
    console.log(`🌐 Open in browser: http://localhost:${PORT}`);
    console.log('\n✨ Press Ctrl+C to stop the server\n');
});

