# Handles routes, interacts with services
# Fitness plan creation and update


from flask import Blueprint, request, jsonify
from services.fitness_plan_service import create_fitness_plan, get_fitness_plan

fitness_plan_controller = Blueprint('fitness_plan_controller', __name__)


# Route for fitness plan creation
@fitness_plan_controller.route('/survey', methods=['POST'])
def fitness_plan_creation_route():
    try:
        # Get JSON data from the request body
        data = request.get_json()

        # Extract survey information
        user_name = data.get('user_name')
        fitness_goal = data.get('fitness_goal')
        fitness_level = data.get('fitness_level')
        equipment_preference = data.get('equipment_preference')

        # Call the service function to create fitness plan
        fitness_plan, error = create_fitness_plan(user_name, fitness_goal, fitness_level, equipment_preference)

        if error:
            return jsonify({"message": error}), 400
        
        # If fitness plan creation is successful, return fitness plan
        return jsonify({"username": user_name, "message": "Fitness plan created successfully", "fitness_plan": fitness_plan}), 201

    except Exception as e:
        return jsonify({"message": "Internal server error", "error": str(e)}), 500
    

# Route for fitness plan retrieval
@fitness_plan_controller.route('/fitnessplan', methods=['GET'])
def fitness_plan_retrival_route():
    try:
        # Get the username from query string
        username = request.args.get('username')  # Using query parameters to get username

        if not username:
            return jsonify({"message": "Username is required"}), 400

        # Call the service function to retrieve fitness plan
        fitness_plan, error = get_fitness_plan(username)

        if error:
            return jsonify({"message": error}), 400
        
        # If fitness plan retrieval is successful, return fitness plan
        return jsonify({"message": "Fitness plan retrieved successfully", "fitness_plan": fitness_plan}), 200

    except Exception as e:
        return jsonify({"message": "Internal server error", "error": str(e)}), 500