from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
import bcrypt

app = Flask(__name__)

app.config["MONGO_URI"] = "mongodb://localhost:27017/workoutDB"
mongo = PyMongo(app)
users_collection = mongo.db.users

@app.route('/backend', methods=['POST'])
def register():
    try:
        data = request.json

        if not isinstance(data, list) or len(data) != 3:
            return jsonify(False)
        
        email, username, password = data

        if users_collection.find_one({'email': email}):
            return jsonify(False)
        
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        users_collection.insert_one({
            "email": email,
            "username": username,
            "password":password,
        })

        return jsonify(True)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify (False)

if __name__ == '__main':
    app.run(debug=True, port = 5000)
