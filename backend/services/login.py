from flask import Blueprint, request, jsonify, current_app
from flask_pymongo import PyMongo
import bcrypt
import logging
from flask_jwt_extended import JWTManager, create_access_token
from datetime import timedelta

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

login_bp = Blueprint('auth_service', __name__)
mongo = PyMongo()

@login_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        logging.info("Received login data: %s", data)

        if not data:
            return jsonify({"success": False, "message": "No data provided"}), 400

        mongo = current_app.mongo

        # retrieve username and password from inbound json request
        if isinstance(data, list) and len(data) == 2:
            email, password = data
        # ✅ Handle object-based data (better practice, more standard)
        elif isinstance(data, dict):
            email = data.get('email') or data.get('username')  # Handle either 'email' or 'username'
            password = data.get('password')
        else:
            logging.warning("Invalid request format")
            return jsonify({"success": False, "message": "Invalid request format"}), 400

        if not email or not password:
            logging.warning("Missing email/username or password")
            return jsonify({"success": False, "message": "Missing required fields"}), 400

        # Search by email OR username (make flexible)
        user = mongo.db.users.find_one({"email": email.lower()})
        if not user:
            logging.warning("User not found for email: %s", email)
            return jsonify({"success": False, "message": "Invalid credentials"}), 401

        stored_password = user.get('password')
        if isinstance(stored_password, str):
            stored_password = stored_password.encode('utf-8')

        if not bcrypt.checkpw(password.encode('utf-8'), stored_password):
            logging.warning("Invalid password for email: %s", email)
            return jsonify({"success": False, "message": "Invalid credentials"}), 401

        # Use email as the "identity" for JWT
        access_token = create_access_token(identity=email, expires_delta=timedelta(hours=2))

        logging.info("User logged in successfully: %s", email)
        return jsonify({
            "success": True,
            "access_token": access_token,
            "username": user.get("username"),
            "avatar": user.get("avatar", 1),
            "message": "Login successful"
        }), 200

    except Exception as e:
        logging.error("Error during login: %s", str(e))
        return jsonify({"success": False, "message": f"Server error: {str(e)}"}), 500