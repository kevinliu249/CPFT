import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalStateContext } from "../context/GlobalStateContext"; // global context
import "../styles/App.css";    
import "../styles/Dashboard.css"; 

const EditWorkout = ({ username }) => {
  const navigate = useNavigate();
  const { theme } = useContext(GlobalStateContext);

  // Holds the exercises in the user's fitness plan
  const [planExercises, setPlanExercises] = useState([]);
  // State for error/loading
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // For adding a new exercise
  const [newExercise, setNewExercise] = useState({
    name: "",
    target: "",
    equipment: ""
  });

  // Fetch existing fitness plan
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await fetch(`http://localhost:5000/fitnessplan?username=${username}`);
        if (!response.ok) {
          throw new Error("Failed to fetch fitness plan");
        }
        const data = await response.json();
        if (!data.fitness_plan || data.fitness_plan.message) {
          // If the backend returned a "Fitness plan not found" or similar
          setPlanExercises([]);
        } else {
          // data.fitness_plan typically looks like: { message, fitness_plan } or an array
          // Since we returned from the service as "[planData, null]", we might need to parse carefully
          // In your code, the "fitness_plan" property might contain the actual array
          const plan = data.fitness_plan[0]?.fitness_plan || data.fitness_plan.fitness_plan || [];
          setPlanExercises(Array.isArray(plan) ? plan : []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [username]);

  // Handle removing an exercise
  const handleRemoveExercise = async (exerciseName) => {
    try {
      const response = await fetch("http://localhost:5000/fitnessplan/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          action: "remove",
          exercise_data: { name: exerciseName }
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

  // Handle adding a new exercise
  const handleAddExercise = async () => {
    if (!newExercise.name.trim()) {
      alert("Please enter at least a name for the new exercise.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/fitnessplan/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          action: "add",
          exercise_data: {
            name: newExercise.name.trim(),
            target: newExercise.target.trim(),
            equipment: newExercise.equipment.trim()
          }
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to add exercise");
      }
      const result = await response.json();
      setPlanExercises(result.updated_plan || []);
      // Reset the input fields
      setNewExercise({ name: "", target: "", equipment: "" });
    } catch (err) {
      alert(err.message);
    }
  };

  // Capitalize for display
  const capitalize = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (loading) {
    return <p>Loading plan...</p>;
  }
  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className={`Dashboard ${theme}`}>
      <div id="dashboardContainer">
        <h1>Edit Workout Plan</h1>
        <hr />
        {planExercises.length === 0 ? (
          <p>No exercises in your plan yet.</p>
        ) : (
          <div className="workout-list">
            {planExercises.map((exercise, index) => (
              <div key={index} className="workout-card">
                <h2>{capitalize(exercise.name || "Untitled Exercise")}</h2>
                <p><strong>Target:</strong> {capitalize(exercise.target || "N/A")}</p>
                <p><strong>Equipment:</strong> {capitalize(exercise.equipment || "N/A")}</p>
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
        <h3>Add a New Exercise</h3>
        <div>
          <input
            type="text"
            placeholder="Exercise name"
            value={newExercise.name}
            onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Target muscle"
            value={newExercise.target}
            onChange={(e) => setNewExercise({ ...newExercise, target: e.target.value })}
          />
          <input
            type="text"
            placeholder="Equipment"
            value={newExercise.equipment}
            onChange={(e) => setNewExercise({ ...newExercise, equipment: e.target.value })}
          />
          <button onClick={handleAddExercise} className="submit-workout-button">
            Add Exercise
          </button>
        </div>

        <hr />
        <button onClick={() => navigate("/dashboard")} className="workout-back-button">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default EditWorkout;
