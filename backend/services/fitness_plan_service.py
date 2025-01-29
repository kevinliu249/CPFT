from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager, jwt_required
from datetime import datetime

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/cpft"
mongo = PyMongo(app)
app.config["JWT_SECRET_KEY"] = "supersecret"
jwt = JWTManager(app)

# Retrieve a Fitness Plan by Username
@app.route("/api/workouts/<username>", methods=["GET"])
@jwt_required()
def get_fitness_plan(username):
    fitness_plan = mongo.db.fitness_plans.find_one({"username": username}, {"_id": 0})
    if not fitness_plan:
        return jsonify({"message": "Fitness plan not found"}), 404
    return jsonify(fitness_plan), 200

# Create a Fitness Plan
@app.route("/api/workouts", methods=["POST"])
@jwt_required()
def create_fitness_plan():
    data = request.json
    fitness_plan = {
        "username": data["username"],
        "fitness_goal": data["fitness_goal"],
        "fitness_level": data["fitness_level"],
        "equipment_preference": data["equipment_preference"],
        "fitness_plan": data["fitness_plan"],
        "recent_exercises": [],
        "created_at": datetime.utcnow()
    }
    
    mongo.db.fitness_plans.insert_one(fitness_plan)
    return jsonify({"message": "Workout plan created successfully"}), 201

if __name__ == "__main__":
    app.run(port=5002, debug=True)
