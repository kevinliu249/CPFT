# To be used for storing and retrieving exercises from MongoDB
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
import logging
from config import Config

app = Flask(__name__)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

app.config["MONGO_URI"] = Config.MONGO_URI
mongo = PyMongo(app)
exercises_collection = mongo.db.exercises

@app.route('/exercise', methods=['POST'])
def store_exercise():
    try:
        data = request.json 
        logging.info("Received exercise data: %s", data)

        # Validate required fields
        if not all(k in data for k in ["name", "muscle_group", "difficulty"]):
            logging.warning("Missing required fields")
            return jsonify({"success": False, "message": "Missing required fields"}), 400

        name = data["name"].strip().lower() 
        muscle_group = data["muscle_group"]
        difficulty = data["difficulty"]

        # Check if exercise already exists
        if exercises_collection.find_one({"name": name}):
            logging.warning("Exercise already exists: %s", name)
            return jsonify({"success": False, "message": "Exercise already exists"}), 409

        # Insert new exercise
        exercises_collection.insert_one({
            "name": name,
            "muscle_group": muscle_group,
            "difficulty": difficulty
        })

        logging.info("Exercise added successfully: %s", name)
        return jsonify({"success": True, "message": "Exercise added successfully"}), 201

    except Exception as e:
        logging.error("Error storing exercise: %s", str(e))
        return jsonify({"success": False, "message": "Server error"}), 500

@app.route('/exercises', methods=['GET'])
def get_exercises():
    try:
        logging.info("Fetching all exercises")
        exercises = list(exercises_collection.find({}, {"_id": 0}))

        if not exercises:
            logging.warning("No exercises found")
            return jsonify({"success": False, "message": "No exercises found"}), 404

        return jsonify({"success": True, "exercises": exercises}), 200

    except Exception as e:
        logging.error("Error fetching exercises: %s", str(e))
        return jsonify({"success": False, "message": "Server error"}), 500

if __name__ == '__main__':
    logging.info("Starting Store Exercise Microservice")
    app.run(debug=True) 
