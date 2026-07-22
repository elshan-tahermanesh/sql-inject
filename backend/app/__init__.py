from flask import Flask
from flask_cors import CORS
from config import Config

def create_app(config_class=Config):
    """
    Flask Application Factory
    Initializes Flask configuration, enables CORS, and registers Blueprints.
    """
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Enable Cross-Origin Resource Sharing (CORS) for all routes
    CORS(app)
    
    # Import Blueprints internally to avoid circular dependencies
    from .controllers.api_controller import api_bp
    from .controllers.auth_controller import auth_bp
    from .controllers.demo_controller import demo_bp
    from routes.attack_routes import attack_bp
    
    # Register Blueprints with appropriate URL prefixes
    app.register_blueprint(api_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(demo_bp, url_prefix='/api')
    app.register_blueprint(attack_bp, url_prefix='/api/attacks')
    
    return app
