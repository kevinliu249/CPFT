# Handles user registration and login routes routes, interacts with services

from flask import Blueprint, request, jsonify
from services.user_service import register_user

user_controller = Blueprint('user_controller', __name__)

@user_controller.route('/register', methods=['POST'])
def register_user_route():
    try:
        # Get JSON data from the request body
        data = request.get_json()

        # Extract user information
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({"message": "Missing required fields"}), 400
        
        # Call the service function to register the user
        user, error = register_user(username, password)

        if error:
            return jsonify({"message": error}), 400
        
        # If registration is successful, return user data (username)
        return jsonify({"message": "User registered successfully", "user": user}), 201

    except Exception as e:
        return jsonify({"message": "Internal server error", "error": str(e)}), 500