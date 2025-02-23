// EditWorkout.js
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalStateContext } from "../context/GlobalStateContext"; 
import "../styles/App.css";     
import "../styles/Workout.css"; 

// List of known target muscle values from the ExerciseDB
// https://rapidapi.com/thisishealfy/api/exercisedb/
// Include 'cardiovascular system' for cardio, plus standard muscle groups:
const muscleGroups = [
  "cardiovascular system",
  "abductors",
  "abs",
  "adductors",
  "biceps",
  "calves",
  "delts",
  "glutes",
  "hamstrings",
  "lats",
  "pectorals",
  "quads",
  "traps",
  "triceps",
  "upper back",
];

// Known equipment from the ExerciseDB (muscle mass + cardio sets combined)
const equipmentOptions = [
  "body weight",
  "medicine ball",
  "barbell",
  "cable",
  "dumbbell",
  "ez barbell",
  "kettlebell",
  "smith machine",
  "leverage machine",
  "stationary bike",
  "elliptical machine",
  "stepmill machine",
];

const EditWorkout = ({ username }) => {
  const navigate = useNavigate();
  const { theme } = useContext(GlobalStateContext);

  // Holds the exercises in the user's current fitness plan
  const [planExercises, setPlanExercises] = useState([]);

  // For error/loading states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For the search form
  // Select from muscleGroups
  const [searchTarget, setSearchTarget] = useState("");
  const [searchEquipment, setSearchEquipment] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedExerciseName, setSelectedExerciseName] = useState("");

  // --- 1) FETCH THE USER'S CURRENT PLAN ON MOUNT ---
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/fitnessplan?username=${username}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch fitness plan");
        }
        const data = await response.json();

        // data.fitness_plan might be shaped like [planData, null] or some structure
        // Adjust as needed
        if (!data.fitness_plan || data.fitness_plan.message) {
          setPlanExercises([]);
        } else {
          const raw = data.fitness_plan;
          // If it's an array with index [0]
          const firstItem = Array.isArray(raw) ? raw[0] : raw;
          // Then the actual plan array might be in firstItem.fitness_plan
          const planArray = firstItem?.fitness_plan || [];
          setPlanExercises(Array.isArray(planArray) ? planArray : []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [username]);

  // --- 2) REMOVE EXERCISE FROM PLAN ---
  const handleRemoveExercise = async (exerciseName) => {
    try {
      const response = await fetch("http://localhost:5000/fitnessplan/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          action: "remove",
          exercise_data: { name: exerciseName },
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to remove exercise");
      }
      const result = await response.json();
      setPlanExercises(result.updated_plan || []);
    } catch (err) {
      alert(err.message);
    }
  };

  // --- 3) SEARCH EXERCISES (CALLS /api/searchExercises) ---
  const handleSearch = async () => {
    // if user didn't select a muscle group or equipment, we can still let them do partial
    if (!searchTarget && !searchEquipment) {
      alert("Please select a target muscle or equipment to search");
      return;
    }
    try {
      // We'll pass the exact strings as query params
      // e.g. /api/searchExercises?target=pectorals&equipment=barbell
      const response = await fetch(
        `http://localhost:5000/api/searchExercises?target=${searchTarget}&equipment=${searchEquipment}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch exercises");
      }
      const data = await response.json();
      setSearchResults(data || []);
      setSelectedExerciseName(""); // Reset selection
    } catch (err) {
      alert(err.message);
    }
  };

  // --- 4) ADD SELECTED EXERCISE FROM SEARCH RESULTS ---
  const handleAddFromSearch = async () => {
    if (!selectedExerciseName) {
      alert("Please select an exercise from the dropdown");
      return;
    }
    // The searchResults array comes from the ExerciseDB, so find the chosen object
    const chosenExercise = searchResults.find(
      (ex) => ex.name.toLowerCase() === selectedExerciseName.toLowerCase()
    );
    if (!chosenExercise) {
      alert("Selected exercise not found in search results");
      return;
    }

    // Prepare the exercise_data object for your plan
    const exerciseData = {
      name: chosenExercise.name,
      target: chosenExercise.target,
      equipment: chosenExercise.equipment
      // More properties can be added
    };

    try {
      const response = await fetch("http://localhost:5000/fitnessplan/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          action: "add",
          exercise_data: exerciseData,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to add exercise");
      }
      const result = await response.json();
      setPlanExercises(result.updated_plan || []);
    } catch (err) {
      alert(err.message);
    }
  };

  // Utility for capitalizing
  const capitalize = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (loading) return <p>Loading plan...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={`Dashboard ${theme}`}>
      <div id="dashboardContainer">
        <h1>Edit Workout Plan</h1>
        <hr />

        {/* --- DISPLAY CURRENT EXERCISES IN PLAN --- */}
        {planExercises.length === 0 ? (
          <p>No exercises in your plan.</p>
        ) : (
          <div className="workout-list">
            {planExercises.map((exercise, idx) => (
              <div key={idx} className="workout-card">
                <h2>{capitalize(exercise.name)}</h2>
                <p><strong>Target:</strong> {capitalize(exercise.target)}</p>
                <p><strong>Equipment:</strong> {capitalize(exercise.equipment)}</p>
                <button
                  onClick={() => handleRemoveExercise(exercise.name)}
                  className="workout-back-button"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <hr />

        {/* --- SEARCH FORM --- */}
        <h2>Search Exercises</h2>
        <p>Select a muscle group or enter equipment, then click Search.</p>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ marginRight: "5px" }}>Target Muscle:</label>
          <select
            value={searchTarget}
            onChange={(e) => setSearchTarget(e.target.value)}
            style={{ marginRight: "5px" }}
          >
            <option value="">-- Optional --</option>
            {muscleGroups.map((muscle) => (
              <option key={muscle} value={muscle}>
                {capitalize(muscle)}
              </option>
            ))}
          </select>

          <label>Equipment:</label>
          <select
            value={searchEquipment}
            onChange={(e) => setSearchEquipment(e.target.value)}
          >
            <option value="">-- Optional --</option>
            {equipmentOptions.map((equip) => (
              <option key={equip} value={equip}>{equip}</option>
            ))}
          </select>

          <button onClick={handleSearch} className="submit-workout-button">
            Search
          </button>
        </div>

        {/* --- DISPLAY SEARCH RESULTS & ADD --- */}
        {searchResults.length > 0 && (
          <div style={{ marginBottom: "1rem" }}>
            <p>
              Found {searchResults.length} exercise
              {searchResults.length > 1 ? "s" : ""} (limited to 20).
            </p>
            <select
              value={selectedExerciseName}
              onChange={(e) => setSelectedExerciseName(e.target.value)}
            >
              <option value="">Select an exercise to add</option>
              {searchResults.map((ex) => (
                <option key={ex.id} value={ex.name}>
                  {ex.name}
                </option>
              ))}
            </select>
            <button onClick={handleAddFromSearch} className="submit-workout-button">
              Add Selected Exercise
            </button>
          </div>
        )}

        <hr />
        <button onClick={() => navigate("/dashboard")} className="workout-back-button">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default EditWorkout;
