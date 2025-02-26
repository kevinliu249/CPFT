import requests, random
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from models.survey_model import retrieve_user_survey
from datetime import datetime


def avoid_repetition(user_name, fitness_plan):
    from app import mongo
    # Retrieve the user's workout logs from the "workoutlogs" collection
    user_workoutlog = list(mongo.db.workoutlogs.find({"username": user_name}).sort("datetime", -1).limit(2))

    # If no logs are found, return the original fitness plan
    if not user_workoutlog:
        return fitness_plan
    
    # Get the target muscle of exercises from the most recent workout entries
    previous_exercise_targets = []
    for workout in user_workoutlog:
        exercise_target = workout.get("target", "").lower()  # Normalize to lowercase for comparison
        previous_exercise_targets.append(exercise_target)

    # For Cardiovascular Exercises, avoid repeating same exercises by fetching exercise names
    if "cardiovascular system" in previous_exercise_targets:
        previous_exercise_names = []
        for workout in user_workoutlog:
            exercise_name = workout.get("name", "").lower()  # Normalize to lowercase for comparison
            previous_exercise_names.append(exercise_name)

        new_fitness_plan = [
        exercise for exercise in fitness_plan if exercise["name"].lower() not in previous_exercise_names
        ]

        return new_fitness_plan
    
    # For Muscle Mass workouts, avoid repeating the same target muscle group
    else:
        # Filter out exercises in the current fitness plan based on recent target muscle group
        new_fitness_plan = [
        exercise for exercise in fitness_plan if exercise["target"].lower() not in previous_exercise_targets
        ]

        return new_fitness_plan 


def select_two_exercises(workout_pool):
    if len(workout_pool) > 2:
        selected_workouts = random.sample(workout_pool, 2)
        for exercises in selected_workouts:
            exercises.pop("bodyPart", None)
            exercises.pop("id", None)
            exercises.pop("secondaryMuscles", None)
            exercises.pop("equipment", None)
            exercises.pop("gifUrl", None)
        return selected_workouts
    # return workout_pool


def new_gif(exercise_data, exercise_name):
    for exercise in exercise_data:
        # Check if the exercise name matches
        if exercise['name'].lower() == exercise_name.lower():
            # Return the gifUrl if a match is found
            return exercise.get('gifUrl', 'URL not available')  # Return a default message if gifUrl is missing
    return 'Exercise not found in the plan'


def fetch_current_data(exercise_name):
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

        new_gif_Url = new_gif(exercises_data, exercise_name)

        return new_gif_Url

    else:
        # Handle API request failure
        return {"error": "Failed to retrieve exercises from the ExerciseDB API"}


def assign_intensity(user_name, two_exercises):
    from app import mongo
    user_survey = mongo.db.surveys.find_one({"user_name": user_name})
    fitness_level = user_survey["fitness_level"]
    fitness_goal = user_survey["fitness_goal"]
    equipment_preference = user_survey["equipment_preference"]

    # For Cardio/ Endurance
    if fitness_goal == "cardio_endurance":
        if fitness_level == "beginner":
            for exercise in two_exercises:
                exercise["Weight"] = "N/A"
                exercise["Reps"] = "N/A"
                exercise["Time"] = "5 minutes"
                exercise["Intensity"] = "3 RPE"
        elif fitness_level == "intermediate":
            for exercise in two_exercises:
                exercise["Weight"] = "N/A"
                exercise["Reps"] = "N/A"
                exercise["Time"] = "10 minutes"
                exercise["Intensity"] = "5 RPE"
        elif fitness_level == "advanced":
            for exercise in two_exercises:
                exercise["Weight"] = "N/A"
                exercise["Reps"] = "N/A"
                exercise["Time"] = "15 minutes"
                exercise["Intensity"] = "8 RPE"

    # For Muscle Mass
    elif fitness_goal == "muscle_mass":
        if equipment_preference == "weights":
            if fitness_level == "beginner":
                for exercise in two_exercises:
                    exercise["Weight"] = "50% 1RM"
                    exercise["Reps"] = "2x12"
                    exercise["Time"] = "N/A"
                    exercise["Intensity"] = "N/A"
            elif fitness_level == "intermediate":
                for exercise in two_exercises:
                    exercise["Weight"] = "60% 1RM"
                    exercise["Reps"] = "3x10"
                    exercise["Time"] = "N/A"
                    exercise["Intensity"] = "N/A"
            elif fitness_level == "advanced":
                for exercise in two_exercises:
                    exercise["Weight"] = "70% 1RM"
                    exercise["Reps"] = "3x8"
                    exercise["Time"] = "N/A"
                    exercise["Intensity"] = "N/A"
        elif equipment_preference == "bodyweight":
            if fitness_level == "beginner":
                for exercise in two_exercises:
                    exercise["Weight"] = "N/A"
                    exercise["Reps"] = "2x12"
                    exercise["Time"] = "N/A"
                    exercise["Intensity"] = "N/A"
            elif fitness_level == "intermediate":
                for exercise in two_exercises:
                    exercise["Weight"] = "N/A"
                    exercise["Reps"] = "3x10"
                    exercise["Time"] = "N/A"
                    exercise["Intensity"] = "N/A"
            elif fitness_level == "advanced":
                for exercise in two_exercises:
                    exercise["Weight"] = "N/A"
                    exercise["Reps"] = "5x10"
                    exercise["Time"] = "N/A"
                    exercise["Intensity"] = "N/A"
        elif equipment_preference == "none":
            if fitness_level == "beginner":
                for exercise in two_exercises:
                    exercise["Weight"] = "50% 1RM, N/A for bodyweight execise"
                    exercise["Reps"] = "2x12"
                    exercise["Time"] = "N/A"
                    exercise["Intensity"] = "N/A"
            elif fitness_level == "intermediate":
                for exercise in two_exercises:
                    exercise["Weight"] = "60% 1RM, N/A for bodyweight execise"
                    exercise["Reps"] = "3x10"
                    exercise["Time"] = "N/A"
                    exercise["Intensity"] = "N/A"
            elif fitness_level == "advanced":
                for exercise in two_exercises:
                    exercise["Weight"] = "70% 1RM, N/A for bodyweight execise"
                    exercise["Reps"] = "3x8"
                    exercise["Time"] = "N/A"
                    exercise["Intensity"] = "N/A"

    # For Flexibility
    elif fitness_goal == "flexibility":
        if fitness_level == "beginner":
            for exercise in two_exercises:
                exercise["Weight"] = "N/A"
                exercise["Reps"] = "2"
                exercise["Time"] = "15 second hold"
                exercise["Intensity"] = "N/A"
        elif fitness_level == "intermediate":
            for exercise in two_exercises:
                exercise["Weight"] = "N/A"
                exercise["Reps"] = "3"
                exercise["Time"] = "30 second hold"
                exercise["Intensity"] = "N/A"
        elif fitness_level == "advanced":
            for exercise in two_exercises:
                exercise["Weight"] = "N/A"
                exercise["Reps"] = "5"
                exercise["Time"] = "1 minute hold"
                exercise["Intensity"] = "N/A"


    return two_exercises



def generate_workout(user_name, fitness_plan):
    workout_no_repetition = avoid_repetition(user_name, fitness_plan)
    daily_workout = select_two_exercises(workout_no_repetition)
    for exercise in daily_workout:
        new_gif = fetch_current_data(exercise["name"])
        exercise["gifUrl"] = new_gif
    workout_with_intensity = assign_intensity(user_name, daily_workout)

    return workout_with_intensity