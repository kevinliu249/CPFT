# service for tracking user progress via graphical data visualization efforts

# metrics_service.py
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_pymongo import PyMongo
import matplotlib.pyplot as plt
import io
import base64
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
                '_id': {'date': {'$dateToString': {'format': '%Y-%m-%d', 'date': '$date'}}},
                'total_volume': {'$sum': {'$multiply': ['$weight', '$reps', '$sets']}}
            }},
            {'$sort': {'_id.date': 1}}
        ]
        results = list(mongo.db.workouts.aggregate(pipeline))
        if not results:
            logging.warning("No workout data found for user: %s", username)
            return jsonify({"success": False, "message": "No workout data found"}), 404

        dates = [entry['_id']['date'] for entry in results]
        volumes = [entry['total_volume'] for entry in results]

        plt.figure(figsize=(10, 5))
        plt.plot(dates, volumes, marker='o', linestyle='-')
        plt.xlabel('Date')
        plt.ylabel('Total Volume (lbs)')
        plt.title(f'Workout Progress for {exercise_name}')
        plt.xticks(rotation=45)
        plt.grid()
        
        img = io.BytesIO()
        plt.savefig(img, format='png')
        img.seek(0)
        img_base64 = base64.b64encode(img.getvalue()).decode()
        
        logging.info("Workout data successfully retrieved for user: %s", username)
        return jsonify({"success": True, "exercise": exercise_name, "progress": results, "chart": img_base64})
    
    except Exception as e:
        logging.error("Error fetching workout data: %s", str(e))
        return jsonify({"success": False, "message": "Server error"}), 500

