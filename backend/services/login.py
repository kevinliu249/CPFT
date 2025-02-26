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
        username, password = data.get('username'), data.get('password')
        if not username or not password:
            # if either missing
            logging.warning("Missing username or password")
            return jsonify({"success": False, "message": "Missing required fields"}), 400
        # retrieves username and password from database
        user = mongo.db.users.find_one({"username": {"$regex": f"^{username}$", "$options": "i"}})
        if not user:
            logging.warning("User not found: %s", username)
            return jsonify({"success": False, "message": "Invalid credentials"}), 401
        stored_password = user.get('password')
        if isinstance(stored_password, str):
            stored_password = stored_password.encode('utf-8')  # Convert stored hash to bytes

        if not bcrypt.checkpw(password.encode('utf-8'), stored_password):
            logging.warning("Invalid password for username: %s", username)
            return jsonify({"success": False, "message": "Invalid credentials"}), 401

        access_token = create_access_token(identity=username, expires_delta=timedelta(hours=2))
        logging.info("User logged in successfully: %s", username)
        return jsonify({"success": True, "access_token": access_token, "message": "Login successful"}), 200 
    
    except Exception as e:
        logging.error("Error during login: %s", str(e))
        return jsonify({"success": False, "message": f"Server error: {str(e)}"}), 500

