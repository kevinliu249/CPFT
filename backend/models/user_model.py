# Database queries, interacts with MongodB

from flask_pymongo import PyMongo

# Function to create a new user in the database
def create_user(username, password):
    from app import mongo

    user_data = {
        "username": username,
        "password": password,
    }

    # Insert new user document in the "users" collection in MongoDB
    result = mongo.db.users.insert_one(user_data)

    # Get the inserted user data, including the ObjectId
    user_data['_id'] = str(result.inserted_id)  # Convert ObjectId to string

    # Return user data without the password
    user_data.pop('password')
    return user_data