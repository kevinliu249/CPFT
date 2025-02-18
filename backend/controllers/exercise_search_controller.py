# exercise_search_controller.py
# NEW CODE: Provides an endpoint for searching exercises by target muscle & equipment via ExerciseDB

from flask import Blueprint, request, jsonify
import requests

exercise_search_controller = Blueprint('exercise_search_controller', __name__)

@exercise_search_controller.route('/api/searchExercises', methods=['GET'])
def search_exercises():
    """
    GET /api/searchExercises?target=<string>&equipment=<string>
    Returns a filtered list of exercises from the ExerciseDB.
    """
    # Get query params, e.g. ?target=chest&equipment=barbell
    target = request.args.get('target', '').lower()
    equipment = request.args.get('equipment', '').lower()

    # Make a request to the ExerciseDB API
    url = "https://exercisedb.p.rapidapi.com/exercises"
    headers = {
        "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
        "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY"  # <-- replace with your real key
    }
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        return jsonify({"error": "Failed to retrieve exercises"}), 500

    # All exercises is typically a large array. We'll filter on target + equipment:
    all_exercises = response.json()
    filtered = []
    for ex in all_exercises:
        ex_target = ex.get('target', '').lower()
        ex_equipment = ex.get('equipment', '').lower()
        # "Best approach" is flexible. For now, we do a 'substring' match:
        if target in ex_target and equipment in ex_equipment:
            filtered.append(ex)

    # Limit to 20 to prevent overwhelming the user
    filtered = filtered[:20]

    # Return the filtered exercises
    return jsonify(filtered), 200
