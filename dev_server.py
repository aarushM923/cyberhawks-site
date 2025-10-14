# Simple static file server for local preview
from http.server import SimpleHTTPRequestHandler, HTTPServer
import os

PORT = 8000

if __name__ == '__main__':
    os.chdir(os.path.dirname(__file__))
    httpd = HTTPServer(('', PORT), SimpleHTTPRequestHandler)
    print(f"Serving Cyberhawks site at http://localhost:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down...")
        httpd.server_close()
