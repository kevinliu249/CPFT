from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
# from flask_jwt_extended import JWTManager, jwt_required
from datetime import datetime
from models.fitness_plan_model import retrieve_fitness_plan, store_fitness_plan


# Retrieve a Fitness Plan by Username
def get_fitness_plan(user_name):
    from app import mongo
    fitness_plan = retrieve_fitness_plan(user_name)
    return fitness_plan, None



# Create a Fitness Plan
def create_fitness_plan(user_name, fitness_goal, fitness_level, equipment_preference):
    from app import mongo

    # Check if fitness plan already exists
    existing_plan = mongo.db.fitnessplans.find_one({"username": user_name})
    if existing_plan:
        return None, "Fitness plan already exists"


    # algorithm to create new fitness plan, incomplete
    result = "Fitness Plan Algorithm still in the works"

    # Store result by sending it to model
    store_fitness_plan(user_name, result)
    
    # Return the newly created fitness plan, no errors
    return result, None
