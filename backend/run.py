from app import create_app

# Create Flask application instance via factory pattern
app = create_app()

if __name__ == '__main__':
    # Listen on all network interfaces (needed for Docker) at port 5000
    app.run(host='0.0.0.0', port=5000, debug=True)
