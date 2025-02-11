# Logic for daily workout generation, interacts with model

# Generate Daily Workout
# Store Recent Workout

from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from services.workout_algorithm import generate_workout


def create_workout_service(user_name, fitness_plan):
    from app import mongo

    # Call algorithm to create new workout
    result = generate_workout(user_name, fitness_plan)

    # Return the newly created workout, no errors
    return result, None