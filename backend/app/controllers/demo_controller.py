from flask import Blueprint, jsonify, request
from app.models.user_model import check_login

# Define Blueprint for simulation vulnerable and secure endpoints
demo_bp = Blueprint('demo_bp', __name__)

@demo_bp.route('/vulnerable/login', methods=['POST'])
def vulnerable_login():
    """
    POST /api/vulnerable/login
    """
    return jsonify({
        "status": "success",
        "message": "Placeholder vulnerable login endpoint"
    })

@demo_bp.route('/vulnerable/search', methods=['POST'])
def vulnerable_search():
    """
    POST /api/vulnerable/search
    """
    return jsonify({
        "status": "success",
        "message": "Placeholder vulnerable search endpoint"
    })

@demo_bp.route('/vulnerable/create-user', methods=['POST'])
def vulnerable_create_user():
    """
    POST /api/vulnerable/create-user
    """
    return jsonify({
        "status": "success",
        "message": "Placeholder vulnerable create-user endpoint"
    })

@demo_bp.route('/secure/login', methods=['POST'])
def secure_login():
    """
    POST /api/secure/login
    Checks username and password from the users table.
    """
    data = request.get_json() or {}
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({
            "status": "error",
            "message": "Username and password are required"
        }), 400
    user = check_login(username, password)

    if user:
        return jsonify({
            "status": "success",
            "message": "Login successful",
            "user": {
                "id": user["id"],
                "username": user["username"],
                "role": user["role"] }
                })

    return jsonify({
        "status": "error",
        "message": "Invalid username or password"
    }), 401


@demo_bp.route('/secure/search', methods=['POST'])
def secure_search():
    """
    POST /api/secure/search
    """
    return jsonify({
        "status": "success",
        "message": "Placeholder secure search endpoint"
    })

@demo_bp.route('/secure/create-user', methods=['POST'])
def secure_create_user():
    """
    POST /api/secure/create-user
    """
    return jsonify({
        "status": "success",
        "message": "Placeholder secure create-user endpoint"
    })
