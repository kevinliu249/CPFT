# Database queries, interacts with MongodB

from models.survey_model import store_user_survey


def register_survey(user_name, fitness_goal, fitness_level, equipment_preference):
    from app import mongo
    
    # Check if the user already has a survey
    existing_survey = mongo.db.surveys.find_one({"user_name": user_name})

    if existing_survey:
        # If a survey exists, delete the existing entry
        mongo.db.surveys.delete_one({"user_name": user_name})
    
    # Store the user survey
    new_survey = store_user_survey(user_name, fitness_goal, fitness_level, equipment_preference)

    # Return the newly created survey, no errors
    return new_survey, None