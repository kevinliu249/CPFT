# Handles routes, interacts with services
# Daily Workout

from flask import Blueprint, request, jsonify
from services.workout_service import create_workout_service, store_workout_service, log_workout_service, retrieve_workout_service
from services.fitness_plan_service import get_fitness_plan


workout_controller = Blueprint('workout_controller', __name__)


# Route for workout creation
@workout_controller.route('/workout', methods=['GET'])
def workout_creation_route():
    try:
        # Get the username from query parameters
        user_name = request.args.get('username')
        
        if not user_name:
            return jsonify({"message": "Username is required"}), 400
        
        # Call retrieve fitness plan service to get fitness plan based on username
        fitness_plan = get_fitness_plan(user_name)[0][0]
        fitness_plan = fitness_plan["fitness_plan"]

        # Call the workout service function to generate daily workout
        workout, error = create_workout_service(user_name, fitness_plan)

        if error:
            return jsonify({"message": error}), 400
        
        # Call store workout service to store in database
        store_workout = store_workout_service(user_name, workout)
        
        # If workout creation is successful, return workout
        return jsonify({"username": user_name, "message": "Workout created successfully and stored", "workout": workout}), 200

    except Exception as e:
        return jsonify({"message": "Internal server error", "error": str(e)}), 500

# Route for workout storing
@workout_controller.route('/workout', methods=['POST'])
def workout_logging_route():
    try:

        # Get the username from query parameters
        user_name = request.args.get('username')
        
        if not user_name:
            return jsonify({"message": "Username is required"}), 400
        
        workout = retrieve_workout_service(user_name)
        
        # Get JSON data from the request body
        data = request.get_json()

        # Call store workout service
        stored_workout = log_workout_service(user_name, data, workout)

        if stored_workout != True:
            return jsonify({"message": stored_workout}), 400
        
        # If workout storing is successful, return message
        return jsonify({"username": user_name, "message": "Workout stored successfully", "Daily Workout": workout, "Completed Input": data}), 200

    except Exception as e:
        return jsonify({"message": "Internal server error", "error": str(e)}), 500