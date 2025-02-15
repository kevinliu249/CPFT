# Logic for daily workout generation, interacts with model

# Generate Daily Workout
# Store Recent Workout

from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from datetime import datetime
from services.workout_algorithm import generate_workout
from models.workout_model import store_workout_model, retrieve_workout_model, log_workout_model

# Create Daily Workout
def create_workout_service(user_name, fitness_plan):
    from app import mongo

    # Call algorithm to create new workout
    result = generate_workout(user_name, fitness_plan)

    # Return the newly created workout, no errors
    return result, None


# Store Daily workout that was generated
def store_workout_service(user_name, workout):
    from app import mongo

    # Check if daily workout already exists
    existing_plan = mongo.db.dailyworkout.find_one({"username": user_name})
    if existing_plan:
        # If a workout exists, delete the existing entry
        mongo.db.dailyworkout.delete_one({"username": user_name})

    # Call store workout model to store in MongoDB
    store_workout_model(user_name, workout)
    return


# Retrieve Daily Workout that was generated
def retrieve_workout_service(user_name):
    from app import mongo
    workout = retrieve_workout_model(user_name)
    return workout


# Log Workout Data sent from frontend
def log_workout_service(user_name, data, workout):

    current_datetime = datetime.now()
    # Log the date and time in a specific format
    formatted_datetime = current_datetime.strftime("%Y-%m-%d %H:%M:%S")

    first_exercise_data = {
        "username": user_name,
        "name": workout["workout"][0]['name'],
        "target": workout["workout"][0]['target'],
        "sets": data[0]["sets"],
        "reps": data[0]["reps"],
        "weight": data[0]["weight"],
        "time": data[0]["time"],
        "datetime": formatted_datetime
    }

    second_exercise_data = {
        "username": user_name,
        "name": workout["workout"][1]['name'],
        "target": workout["workout"][1]['target'],
        "sets": data[1]["sets"],
        "reps": data[1]["reps"],
        "weight": data[1]["weight"],
        "time": data[1]["time"],
        "datetime": formatted_datetime
    }
    # Call log workout model to store into mongoDB
    log_workout_model(first_exercise_data, second_exercise_data)

    return True