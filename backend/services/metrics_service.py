# service for tracking user progress via graphical data visualization efforts

# metrics_service.py
from flask import Blueprint, request, jsonify, current_app
# Joon If you want to actually render figures with Matplotlib, you’d import matplotlib here.
# import matplotlib
# matplotlib.use('Agg')  # For server-side image generation if needed
# import matplotlib.pyplot as plt

metrics_bp = Blueprint('metrics_bp', __name__)

# Helper function to safely convert a value to an integer
def safe_int(value, default=0):
    try:
        return int(value)
    except (TypeError, ValueError):
        return default

@metrics_bp.route('/metrics/<username>', methods=['GET'])
def get_user_metrics(username):
    mongo = current_app.mongo

    # Fetch workouts for the given username
    workouts = list(mongo.db.workoutlogs.find({"username": username}))

    if not workouts:
        return jsonify({"error": "No workout data found for user"}), 404

    # Instead of only grabbing date, keep the full datetime (down to seconds)
    unique_sessions = set(w['datetime'] for w in workouts if 'datetime' in w)

    session_count = len(unique_sessions)

    def safe_int(value, default=0):
        try:
            return int(value)
        except (TypeError, ValueError):
            return default

    # Highest Reps
    highest_reps = max([safe_int(w.get("reps")) for w in workouts], default=0)
    last_reps = safe_int(workouts[-1].get("reps"))

    # Strength Volume
    highest_volume = max([
        safe_int(w.get("sets")) * safe_int(w.get("reps")) * safe_int(w.get("weight"))
        for w in workouts
    ], default=0)

    last_workout = workouts[-1]
    last_volume = (
        safe_int(last_workout.get("sets")) *
        safe_int(last_workout.get("reps")) *
        safe_int(last_workout.get("weight"))
    )

    # Proper total time from the "time" field
    total_cardio_time = sum([
        safe_int(w.get("time"))
        for w in workouts
    ])

    metrics = {
        "highestReps": highest_reps,
        "lastReps": last_reps,
        "highestVolume": highest_volume,
        "lastVolume": last_volume,
        "totalCardioTime": total_cardio_time,
        "sessionCount": session_count
    }

    return jsonify(metrics), 200