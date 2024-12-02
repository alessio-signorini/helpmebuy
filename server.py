#!/usr/bin/env python3
import http.server
import socketserver
import os
import re

class CategoryHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Handle category-based routing
        if self.path == '/' or self.path == '/index.html':
            self.path = '/index.html'
        elif re.match(r'^/[^/.]+$', self.path):
            # If path is just a category (e.g., /washer), serve index.html
            self.path = '/index.html'
        
        # Convert relative paths to absolute for static files
        if not self.path.startswith('/'):
            self.path = '/' + self.path
            
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

def run_server(port=8000):
    with socketserver.TCPServer(("", port), CategoryHandler) as httpd:
        print(f"Serving at http://localhost:{port}")
        httpd.serve_forever()

if __name__ == "__main__":
    run_server()
