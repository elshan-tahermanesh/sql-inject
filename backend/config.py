import os

class Config:
    """
    SQLi Lab - Flask Application Configuration (Phase 1)
    """
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'sqli-lab-secret-key-placeholder'
    DEBUG = True
    TESTING = False
