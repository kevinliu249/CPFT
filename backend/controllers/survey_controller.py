# Handles user fitness survey routes, interacts with services

from flask import Blueprint, request, jsonify
from services.survey_service import register_survey

survey_controller = Blueprint('survey_controller', __name__)

@survey_controller.route('/survey', methods=['POST'])
def register_survey_route():
    try:
        # Get JSON data from the request body
        data = request.get_json()

        # Extract survey information
        user_name = data.get('user_name')
        fitness_goal = data.get('fitness_goal')
        fitness_level = data.get('fitness_level')
        equipment_preference = data.get('equipment_preference')


        if not user_name or not fitness_goal or not fitness_level or not equipment_preference:
            return jsonify({"message": "Missing required fields"}), 400
        
        # Call the service function to register the survey
        survey, error = register_survey(user_name, fitness_goal, fitness_level, equipment_preference)

        if error:
            return jsonify({"message": error}), 400
        
        # If survey collection is successful, return survey data
        return jsonify({"message": "Survey registered successfully", "survey": survey}), 201

    except Exception as e:
        return jsonify({"message": "Internal server error", "error": str(e)}), 500