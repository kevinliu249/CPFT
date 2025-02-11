from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager, jwt_required
from datetime import datetime

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/cpft"
mongo = PyMongo(app)
app.config["JWT_SECRET_KEY"] = "supersecret"
jwt = JWTManager(app)

# 📌 Log Workout Progress
@app.route("/api/progress", methods=["POST"])
@jwt_required()
def log_progress():
    data = request.json
    progress_entry = {
        "username": data["username"],
        "date": data["date"],
        "exercise": data["stats"]["exercise"],
        "sets": data["stats"]["sets"],
        "reps_per_set": data["stats"]["reps_per_set"],
        "created_at": datetime.utcnow()
    }
    mongo.db.progress.insert_one(progress_entry)
    return jsonify({"message": "Progress logged successfully"}), 201

# Retrieve Progress History
@app.route("/api/progress/<username>", methods=["GET"])
@jwt_required()
def get_progress(username):
    progress_logs = list(mongo.db.progress.find({"username": username}, {"_id": 0}))
    return jsonify(progress_logs), 200

# Update User's Recent Exercises
@app.route("/api/users/<userId>", methods=["PUT"])
@jwt_required()
def update_recent_exercises(userId):
    data = request.json
    updated = mongo.db.users.update_one(
        {"_id": userId},
        {"$set": {"recent_exercises": data["recent_exercises"]}}
    )

    if updated.matched_count == 0:
        return jsonify({"message": "User not found"}), 404
    return jsonify({"message": "Recent exercises updated"}), 200

if __name__ == "__main__":
    app.run(port=5004, debug=True)
