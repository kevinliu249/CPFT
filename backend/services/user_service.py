# Logic for user management, interacts with model

from models.user_model import create_user

def register_user(username, password, email):
    from app import mongo
    # Check if user already exists
    existing_user = mongo.db.users.find_one({"username": username})
    if existing_user:
        return None, "Username already exists"
    
    # Create the user
    new_user = create_user(username, password, email)

    # Return the newly created user, no errors
    return new_user, None