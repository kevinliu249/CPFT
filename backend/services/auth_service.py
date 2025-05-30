from flask import Blueprint, request, jsonify, current_app
from flask_pymongo import PyMongo
import bcrypt
import logging
from config import Config

auth_bp = Blueprint('auth', __name__)

# Setup Logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# MongoDB Configuration
mongo = PyMongo()

@auth_bp.route('/registering', methods=['POST'])
def register():
    try:
        data = request.json
        logging.info("Received registration data: %s", data)

        mongo = current_app.mongo

        if not isinstance(data, list) or len(data) != 4:
            logging.warning("Invalid request format")
            return jsonify({"success": False, "message": "Invalid request format"}), 400
        
        email, username, password, avatar = data
        email = email.lower()

        if not all ([email, username, password, avatar]):
            return jsonify({"success": False, "message": "Missing required fields"}), 400

        if mongo.db.users.find_one({'email': email}):
            logging.warning("Email already registered: %s", email)
            return jsonify({"success": False, "message": "Email already registered"}), 409
        
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        mongo.db.users.insert_one({
            "email": email,
            "username": username,
            "password": hashed_password,
            "avatar": avatar
        })

        logging.info("User registered successfully: %s", email)
        return jsonify({"success": True, "message": "User registered successfully"}), 201

    except Exception as e:
        logging.error("Error during registration: %s", str(e))
        return jsonify({"success": False, "message": "Server error"}), 500

@auth_bp.route('/users', methods=['GET'])
def get_users():
    try:
        logging.info("Fetching all users (excluding passwords)")
        users = list(mongo.db.find({}, {"_id": 0, "password": 0})) 

        if not users:
            logging.warning("No users found")
            return jsonify({"success": False, "message": "No users found"}), 404

        return jsonify({"success": True, "users": users}), 200

    except Exception as e:
        logging.error("Error fetching users: %s", str(e))
        return jsonify({"success": False, "message": "Server error"}), 500

