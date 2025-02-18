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

# NEW CODE: Service to edit a fitness plan (adding or removing a single exercise)
def edit_fitness_plan_service(username, exercise_data, action):
    """
    Edits the user's plan by adding or removing a single exercise.

    exercise_data: e.g. {"name": "...", "target": "...", ...}
    action: "add" or "remove"
    """
    # 1) Retrieve the existing plan
    existing_plan, status_code = retrieve_fitness_plan(username)
    if isinstance(existing_plan, dict) and "message" in existing_plan:
        # If retrieve_fitness_plan returned an error message
        return None, existing_plan["message"]

    # existing_plan should be a dict with "fitness_plan" key
    if not existing_plan or "fitness_plan" not in existing_plan:
        return None, f"No existing plan found for user: {username}"

    plan_list = existing_plan["fitness_plan"]  # This should be a list of exercises

    # 2) Modify plan based on action
    if action == "add":
        plan_list.append(exercise_data)

    elif action == "remove":
        # Filter out items that match the name or other unique field
        plan_list = [ex for ex in plan_list if ex.get("name") != exercise_data.get("name")]
    else:
        return None, "Invalid action. Must be 'add' or 'remove'."

    # 3) Update plan in the DB
    updated, error = update_fitness_plan(username, plan_list)
    if error:
        return None, error
    
    return plan_list, None