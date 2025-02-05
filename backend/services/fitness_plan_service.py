from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
# from flask_jwt_extended import JWTManager, jwt_required
from datetime import datetime
from models.fitness_plan_model import retrieve_fitness_plan, store_fitness_plan
from services.fitness_plan_algorithm import generate_fitness_plan


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
        # If a plan exists, delete the existing entry
        mongo.db.fitnessplans.delete_one({"username": user_name})

    # Call algorithm to create new fitness plan
    result = generate_fitness_plan(fitness_goal, equipment_preference)

    # Store result by sending it to model
    store_fitness_plan(user_name, result)
    
    # Return the newly created fitness plan, no errors
    return result, None
