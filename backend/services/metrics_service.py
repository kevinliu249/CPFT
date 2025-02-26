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

@metrics_service_bp.route('/workout-data', methods=['GET'])
@jwt_required()
def workout_data():
    try:
        # retrieve username and exercise for progress visualization
        username = get_jwt_identity()
        exercise_name = request.args.get('exercise')
        logging.info("Fetching workout data for user: %s, exercise: %s", username, exercise_name)

        mongo = current_app.mongo

        if not exercise_name:
            logging.warning("Exercise parameter is required")
            return jsonify({"success": False, "message": "Exercise parameter is required"}), 400
        # outputs total volume
        pipeline = [
            {'$match': {'username': username, 'exercise': exercise_name}},
            {'$group': {
                '_id': None,
                'highestReps': {'$max': "$reps"},
                'lastReps': {'$last': "$reps"},
                'highestVolume': {'$max': {'$multiply': ['$weight', '$reps', '$sets']}},
                'lastVolume': {'$last': {'$multiply': ['$weight', '$reps', '$sets']}},
                'totalCardioTime': {'$sum': "$cardio_time"},  # Assumes cardio_time is stored
                'sessionCount': {'$sum': 1}
            }}
        ]
        
        results = list(mongo.db.workoutlogs.aggregate(pipeline))
        if not results:
            return jsonify({"success": False, "message": "No workout data found"}), 404

        # Extract values properly
        data = results[0] if results else {}
        
        return jsonify({
            "success": True,
            "metrics": {
                "highestReps": data.get("highestReps", 0),
                "lastReps": data.get("lastReps", 0),
                "highestVolume": data.get("highestVolume", 0),
                "lastVolume": data.get("lastVolume", 0),
                "totalCardioTime": data.get("totalCardioTime", 0),
                "sessionCount": data.get("sessionCount", 0)
            }
        })

    except Exception as e:
        logging.error("Error fetching workout data: %s", str(e))
        return jsonify({"success": False, "message": "Server error"}), 500