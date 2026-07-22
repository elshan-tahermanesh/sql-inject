from flask import Blueprint, jsonify

# Define Blueprint for general API administration routes
api_bp = Blueprint('api_bp', __name__)

@api_bp.route('/health', methods=['GET'])
def health():
    """
    GET /api/health
    Returns service health status
    """
    return jsonify({
        "status": "success",
        "message": "API is running"
    })
