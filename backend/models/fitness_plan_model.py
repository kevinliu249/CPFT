# Fitness plan model (database interactions for plans)

#get_plans_by_username()
#update_plan()

from flask import jsonify
from flask_pymongo import PyMongo

# Store fitness plan in the database
def store_fitness_plan(username, fitness_plan_result):
    from app import mongo

    fitness_plan_data = {
        "username": username,
        "fitness_plan": fitness_plan_result,
    }

    # Insert new fitness plan document in the "fitnessplan" collection in MongoDB
    result = mongo.db.fitnessplans.insert_one(fitness_plan_data)

    # Get the inserted user data, including the ObjectId
    fitness_plan_data['_id'] = str(result.inserted_id)  # Convert ObjectId to string

    return fitness_plan_data


# Retrieve fitness plan from the database
def retrieve_fitness_plan(username):
    from app import mongo
    fitness_plan = mongo.db.fitnessplans.find_one({"username": username})

    # Get the fitness plan, including the ObjectId
    fitness_plan['_id'] = str(fitness_plan['_id'])  # Convert ObjectId to string

    if not fitness_plan:
        return jsonify({"message": "Fitness plan not found"}), 404
    
    return fitness_plan, 200

    # NEW CODE: Update an existing fitness plan in the database
def update_fitness_plan(username, updated_plan):
    """
    Overwrites the current fitness_plan array for the specified user.
    """
    from app import mongo
    
    # Use update_one to set the new plan
    result = mongo.db.fitnessplans.update_one(
        {"username": username},
        {"$set": {"fitness_plan": updated_plan}}
    )

    if result.matched_count == 0:
        # Return an error if no document was found
        return None, "No existing plan found for user: " + username

    # Return success if updated
    return True, None