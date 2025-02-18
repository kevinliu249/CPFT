# Workout model (database interactions for Workout)

# Retrieve Recent Workouts
# Store Recent Workouts

from flask import jsonify
from flask_pymongo import PyMongo
from datetime import datetime


# Store daily workout in the database
def store_workout_model(username, workout):
    from app import mongo

    daily_workout_data = {
        "username": username,
        "workout": workout,
    }

    # Insert new workout document in the "workout" collection in MongoDB
    result = mongo.db.dailyworkout.insert_one(daily_workout_data)

    # Get the inserted user data, including the ObjectId
    daily_workout_data['_id'] = str(result.inserted_id)  # Convert ObjectId to string

    return daily_workout_data



# Retrieve Daily Workout from the database
def retrieve_workout_model(user_name):
    from app import mongo
    workout = mongo.db.dailyworkout.find_one({"username": user_name})
    
    # Get the workout, including the ObjectId
    workout['_id'] = str(workout['_id'])  # Convert ObjectId to string
    return workout



# Log completed workout in database
def log_workout_model(first_exercise, second_exercise):
    from app import mongo

    # Insert new workout document in the "workout" collection in MongoDB
    first_result = mongo.db.workoutlogs.insert_one(first_exercise)
    second_result = mongo.db.workoutlogs.insert_one(second_exercise)

    return