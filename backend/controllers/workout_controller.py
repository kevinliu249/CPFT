# Handles routes, interacts with services
# Daily Workout

from flask import Blueprint, request, jsonify
from services.workout_service import create_workout_service
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
        
        # If workout creation is successful, return workout
        return jsonify({"username": user_name, "message": "Workout created successfully", "workout": workout}), 200

    except Exception as e:
        return jsonify({"message": "Internal server error", "error": str(e)}), 500