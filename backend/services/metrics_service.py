# service for tracking user progress via graphical data visualization efforts

# metrics_service.py
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_pymongo import PyMongo
import logging
# Joon If you want to actually render figures with Matplotlib, you’d import matplotlib here.
# import matplotlib
# matplotlib.use('Agg')  # For server-side image generation if needed
# import matplotlib.pyplot as plt
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

metrics_service_bp = Blueprint('metrics_bp', __name__)

mongo = PyMongo()

@metrics_service_bp.route('/metrics/<username>', methods=['GET'])
@jwt_required()
def get_user_metrics(username):
    try:
        logging.info("Fetching metrics for user: %s", username)
        
        mongo = current_app.mongo
        pipeline = [
            {'$match': {'username': username}},
            {'$group': {
                '_id': None,
                'highestReps': {'$max': "$reps"},
                'lastReps': {'$last': "$reps"},
                'highestVolume': {'$max': {'$multiply': ['$weight', '$reps', '$sets']}},
                'lastVolume': {'$last': {'$multiply': ['$weight', '$reps', '$sets']}},
                'totalCardioTime': {'$sum': "$cardio_time"},  # Assuming this field exists
                'sessionCount': {'$sum': 1}
            }}
        ]
        
        results = list(mongo.db.workoutlogs.aggregate(pipeline))
        if not results:
            logging.warning("No metrics found for user: %s", username)
            return jsonify({"success": False, "message": "No metrics found"}), 404

        # Extract values properly
        data = results[0] if results else {}

        return jsonify({
            "highestReps": data.get("highestReps", 0),
            "lastReps": data.get("lastReps", 0),
            "highestVolume": data.get("highestVolume", 0),
            "lastVolume": data.get("lastVolume", 0),
            "totalCardioTime": data.get("totalCardioTime", 0),
            "sessionCount": data.get("sessionCount", 0)
        })

    except Exception as e:
        logging.error("Error fetching user metrics: %s", str(e))
        return jsonify({"success": False, "message": "Server error"}), 500