# Logic for user survey, interacts with model

from flask_pymongo import PyMongo

# Function to store user survey in the database
def store_user_survey(user_name, fitness_goal, fitness_level, equipment_preference):
    from app import mongo

    survey_data = {
        "user_name": user_name,
        "fitness_goal": fitness_goal,
        "fitness_level": fitness_level,
        "equipment_preference": equipment_preference,
    }

    # Insert new surveys document in the "surveys" collection in MongoDB
    result = mongo.db.surveys.insert_one(survey_data)

    # Get the inserted survey data, including the ObjectId
    survey_data['_id'] = str(result.inserted_id)  # Convert ObjectId to string

    # Return user survey data
    return survey_data