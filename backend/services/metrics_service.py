# service for tracking user progress via graphical data visualization efforts

# metrics_service.py
from flask import Blueprint, request, jsonify, current_app
# Joon If you want to actually render figures with Matplotlib, you’d import matplotlib here.
# import matplotlib
# matplotlib.use('Agg')  # For server-side image generation if needed
# import matplotlib.pyplot as plt

metrics_bp = Blueprint('metrics_bp', __name__)
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

    # Process data to calculate metrics
    highest_reps = max([int(w.get("reps") or 0) for w in workouts], default=0)

    last_reps = int(workouts[-1].get("reps", 0))

    # Assuming volume = sets * reps * weight (common metric)
    highest_volume = max([
        safe_int(w.get("sets")) * safe_int(w.get("reps")) * safe_int(w.get("weight"))
        for w in workouts
    ], default=0)

    last_workout = workouts[-1]
    last_volume = int(last_workout.get("sets", 0)) * int(last_workout.get("reps", 0)) * int(last_workout.get("weight", 0))

    # For now, totalCardioTime will be zero unless you have valid `time` data in logs
    total_cardio_time = sum([
        safe_int(w.get("sets")) * safe_int(w.get("reps")) * safe_int(w.get("weight"))
        for w in workouts
    ])

    session_count = len(workouts)

    metrics = {
        "highestReps": highest_reps,
        "lastReps": last_reps,
        "highestVolume": highest_volume,
        "lastVolume": last_volume,
        "totalCardioTime": total_cardio_time,
        "sessionCount": session_count
    }

    return jsonify(metrics), 200

