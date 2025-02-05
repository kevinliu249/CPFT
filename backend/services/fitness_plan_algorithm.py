import requests, random
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
###
#   The algorithm takes in fitness goal and equipment preference collected from the trainer survey,
#   fetches all exercises based on those data from ExerciseDB API
#   returns a list 20 randomized exercise objects from the filtered pool


def filter_exercises(exercises_data, fitness_goal, equipment_preference):

    # For Cardio/ Endurance as Exercise Type/ Goal
    if fitness_goal == "Cardio/Endurance":
        exercise_target = "cardiovascular system"
        if equipment_preference == "Body Weight":
            exercise_equipment = ["body weight"]
        elif equipment_preference == "Weights/ Machines":
            exercise_equipment = ["leverage machine", "dumbbell", "stationary bike", "elliptical machine", "stepmill machine"]
        else:
            exercise_equipment = ["body weight", "leverage machine", "dumbbell", "stationary bike", "elliptical machine", "stepmill machine"]

        filtered_exercises = [
        exercise for exercise in exercises_data
        if exercise.get('target') and exercise_target.lower() in exercise['target'].lower()
        and exercise.get('equipment') and any(equip.lower() in exercise['equipment'].lower() for equip in exercise_equipment)
    ]


    # For Muscle Mass as Exercise Type/ Goal
    elif fitness_goal == "Muscle Mass":
        exercise_target = ["abductors", "abs", "adductors", "biceps", "calves", "delts", "glutes", "hamstrings", "lats", "pectorals", "quads", "traps", "triceps", "upper back"]
        if equipment_preference == "Body Weight":
            equipment = ["body weight"]
        elif equipment_preference == "Weights/ Machines":
            equipment = ["barbell", "cable", "dumbbell", "ez barbell", "kettlebell", "smith machine"]
        elif equipment_preference == "None":
            equipment = ["body weight", "medicine ball", "barbell", "cable", "dumbbell", "ez barbell", "kettlebell", "smith machine"]

        filtered_exercises = [
        exercise for exercise in exercises_data
        if exercise.get('target') and any(targ.lower() in exercise['target'].lower() for targ in exercise_target)
        and exercise.get('equipment') and any(equip.lower() in exercise['equipment'].lower() for equip in equipment)
        and "stretch" not in exercise.get('name', '').lower()  # Exclude exercises with "stretch" in the name
    ]

    # For Flexibility as Exercise Type/ Goal:
    elif fitness_goal == "Flexibility":
        equipment = ["body weight"]
        filtered_exercises = [
        exercise for exercise in exercises_data
        if "stretch" in exercise.get('name', '').lower()  # Check if "stretch" is in the exercise name
        and exercise.get('equipment') and any(equip.lower() in exercise['equipment'].lower() for equip in equipment)
    ]

    # If longer than 20 exercises, randomly pick 20
    if len(filtered_exercises) > 20:
        filtered_exercises = random.sample(filtered_exercises, 20)
        return filtered_exercises

    return filtered_exercises



def generate_fitness_plan(fitness_goal, equipment_preference):
    # ExerciseDB API endpoint and headers
    url = "https://exercisedb.p.rapidapi.com/exercises"
    headers = {
        "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
        "X-RapidAPI-Key": "6b1930c0bemsh7b90e4e2a7c4fbep189deejsn6b951db51c23"
    }

    querystring = {"limit": "0", "offset": "0"}

    # Make a request to the ExerciseDB API
    response = requests.get(url, headers=headers, params=querystring)

    # If the response is successful, parse the exercise data
    if response.status_code == 200:
        exercises_data = response.json()

        exercises = filter_exercises(exercises_data, fitness_goal, equipment_preference)

        return exercises

    else:
        # Handle API request failure
        return {"error": "Failed to retrieve exercises from the ExerciseDB API"}