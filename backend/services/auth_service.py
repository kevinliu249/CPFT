from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
import bcrypt
import logging
from config import Config

app = Flask(__name__)

# Setup Logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# MongoDB Configuration
app.config["MONGO_URI"] = Config.MONGO_URI
mongo = PyMongo(app)
users_collection = mongo.db.users

@app.route('/registering', methods=['POST'])
def register():
    try:
        data = request.json
        logging.info("Received registration data: %s", data)

        if not isinstance(data, list) or len(data) != 3:
            logging.warning("Invalid request format")
            return jsonify({"success": False, "message": "Invalid request format"}), 400
        
        email, username, password = data

        if users_collection.find_one({'email': email}):
            logging.warning("Email already registered: %s", email)
            return jsonify({"success": False, "message": "Email already registered"}), 409
        
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        users_collection.insert_one({
            "email": email,
            "username": username,
            "password": hashed_password
        })

        logging.info("User registered successfully: %s", email)
        return jsonify({"success": True, "message": "User registered successfully"}), 201

    except Exception as e:
        logging.error("Error during registration: %s", str(e))
        return jsonify({"success": False, "message": "Server error"}), 500

@app.route('/users', methods=['GET'])
def get_users():
    try:
        logging.info("Fetching all users (excluding passwords)")
        users = list(users_collection.find({}, {"_id": 0, "password": 0})) 

        if not users:
            logging.warning("No users found")
            return jsonify({"success": False, "message": "No users found"}), 404

        return jsonify({"success": True, "users": users}), 200

    except Exception as e:
        logging.error("Error fetching users: %s", str(e))
        return jsonify({"success": False, "message": "Server error"}), 500

if __name__ == '__main__':
    logging.info("Starting Registration Microservice")
    app.run(debug=True)
