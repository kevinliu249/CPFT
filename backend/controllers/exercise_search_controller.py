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

    # Log the query parameters for debugging
    print(f"Searching with target: '{target}', equipment: '{equipment}'")

    # Make a request to the ExerciseDB API
    url = "https://exercisedb.p.rapidapi.com/exercises"

    querystring = {"limit":"0","offset":"0"}

    headers = {
        "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
        "X-RapidAPI-Key": "6b1930c0bemsh7b90e4e2a7c4fbep189deejsn6b951db51c23"  # API key
    }
    response = requests.get(url, headers=headers, params=querystring)
    if response.status_code != 200:
        return jsonify({"error": "Failed to retrieve exercises"}), 500

    # All exercises is typically a large array. We'll filter on target + equipment:
    all_exercises = response.json()
    print(all_exercises)
    filtered = []
    for ex in all_exercises:
        ex_target = ex.get('target', '').lower()
        ex_equipment = ex.get('equipment', '').lower()
        # flexible. For now, we do a 'substring' match:
        # if both are provided, require exact match
        if target and equipment:
            if ex_target == target and ex_equipment == equipment:
                filtered.append(ex)
        elif target:  # only target specified
            if ex_target == target:
                filtered.append(ex)
        elif equipment:  # only equipment specified
            if ex_equipment == equipment:
                filtered.append(ex)

    # Limit to 20 to prevent overwhelming the user
    filtered = filtered[:20]

    # Return the filtered exercises
    return jsonify(filtered), 200
