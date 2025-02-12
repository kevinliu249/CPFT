import unittest
from unittest.mock import patch
import requests
import random

# Import your functions (assuming they're in a file named `fitness.py`)
from services.fitness_plan_algorithm import filter_exercises, generate_fitness_plan

class TestFitnessPlanAlgorithm(unittest.TestCase):

    def setUp(self):
        """Set up mock exercise data"""
        self.mock_exercises = [
            {"name": "Jumping Jacks", "target": "cardiovascular system", "equipment": "body weight"},
            {"name": "Treadmill Run", "target": "cardiovascular system", "equipment": "treadmill"},
            {"name": "Dumbbell Press", "target": "pectorals", "equipment": "dumbbell"},
            {"name": "Barbell Squat", "target": "quads", "equipment": "barbell"},
            {"name": "Hamstring Stretch", "target": "hamstrings", "equipment": "body weight"},
            {"name": "Cable Fly", "target": "pectorals", "equipment": "cable"},
        ]

    def test_filter_exercises_cardio(self):
        """Test cardio filtering with bodyweight"""
        result = filter_exercises(self.mock_exercises, "cardio_endurance", "bodyweight")
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]["name"], "Jumping Jacks")

    def test_filter_exercises_muscle_mass(self):
        """Test muscle mass filtering with weights"""
        result = filter_exercises(self.mock_exercises, "muscle_mass", "weights")
        self.assertEqual(len(result), 3)
        self.assertIn("Dumbbell Press", [ex["name"] for ex in result])

    def test_filter_exercises_flexibility(self):
        """Test flexibility filtering"""
        result = filter_exercises(self.mock_exercises, "flexibility", "bodyweight")
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]["name"], "Hamstring Stretch")

    def test_filter_exercises_randomized_selection(self):
        """Test if more than 20 exercises are correctly reduced to 20 randomly"""
        large_exercise_list = self.mock_exercises * 5  # Simulate a large dataset
        result = filter_exercises(large_exercise_list, "muscle_mass", "weights")
        self.assertLessEqual(len(result), 20, "Filtered exercises should be 20 or fewer")
        self.assertGreater(len(result), 0, "Filtered exercises should return at least 1 if matching exercises exist")

    @patch("requests.get")
    def test_generate_fitness_plan_success(self, mock_get):
        """Test successful API response"""
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = self.mock_exercises

        result = generate_fitness_plan("muscle_mass", "weights")
        self.assertEqual(len(result), 3)
        self.assertIn("Dumbbell Press", [ex["name"] for ex in result])

    @patch("requests.get")
    def test_generate_fitness_plan_api_failure(self, mock_get):
        """Test API failure response"""
        mock_get.return_value.status_code = 500  # Simulate API failure

        result = generate_fitness_plan("muscle_mass", "weights")
        self.assertEqual(result, {"error": "Failed to retrieve exercises from the ExerciseDB API"})

def test_filter_exercises_randomized_selection(self):
    """Test if more than 20 exercises are correctly reduced to 20 randomly"""
    large_exercise_list = self.mock_exercises * 5  # Simulate a large dataset

    # Print the number of exercises before and after filtering
    print(f"Total exercises before filtering: {len(large_exercise_list)}")

    result = filter_exercises(large_exercise_list, "muscle_mass", "weights")

    print(f"Total exercises after filtering: {len(result)}")

    self.assertLessEqual(len(result), 20, "Filtered exercises should be 20 or fewer")
    self.assertGreater(len(result), 0, "Filtered exercises should return at least 1 if matching exercises exist")



if __name__ == "__main__":
    unittest.main()
