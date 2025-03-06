import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Workout.css";

const Workout = ({ username }) => {
  const navigate = useNavigate();

  // State for fetched workouts
  const [workouts, setWorkouts] = useState([]);
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State for user input
  const [completedInputs, setCompletedInputs] = useState({});

  // Fetch workouts on component mount
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        // Get daily workout from the Flask Endpoint
        const response = await fetch(`https://cpft-a9479a55d4c6.herokuapp.com/workout?username=${username}`);
        if (!response.ok) throw new Error("Failed to fetch workouts");

        const data = await response.json();
        console.log("Fetched data:", data);
        // "workouts" should be an array with 2 exercises
        setWorkouts(Array.isArray(data.workout) ? data.workout : []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [username]);

  // Handle user input changes
  const handleInputChange = (index, field, value) => {
    setCompletedInputs((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: value,
      },
    }));
  };

  const handleSubmitWorkout = async () => {
    // Validation: check each required field to make sure it's numeric (including zero)
    for (let i = 0; i < workouts.length; i++) {
      const w = workouts[i];
      const inputs = completedInputs[i] || {};

      // If this workout uses sets/reps/weight
      if (w.Reps !== "N/A") {
        // Parse sets & reps
        const setsVal = parseInt(inputs.sets, 10);
        const repsVal = parseInt(inputs.reps, 10);

        if (isNaN(setsVal)) {
          alert(`Please enter a numeric value for "Sets" (0 if needed) for exercise #${i + 1}.`);
          return;
        }
        if (isNaN(repsVal)) {
          alert(`Please enter a numeric value for "Reps" (0 if needed) for exercise #${i + 1}.`);
          return;
        }
        // If there's a weight field
        if (w.Weight !== "N/A") {
          const weightVal = parseInt(inputs.weight, 10);
          if (isNaN(weightVal)) {
            alert(`Please enter a numeric value for "Weight" (0 if needed) for exercise #${i + 1}.`);
            return;
          }
        }
      } else {
        // If purely time-based
        const timeVal = parseInt(inputs.time, 10);
        if (isNaN(timeVal)) {
          alert(`Please enter a numeric value for "Time" (0 if needed) for exercise #${i + 1}.`);
          return;
        }
      }
    }

    // Build the submission array
    const submissionArray = workouts.map((_, idx) => ({
      sets: completedInputs[idx]?.sets || null,
      reps: completedInputs[idx]?.reps || null,
      weight: completedInputs[idx]?.weight || null,
      time: completedInputs[idx]?.time || null,
    }));

    try {
      const response = await fetch(`https://cpft-a9479a55d4c6.herokuapp.com/workout?username=${username}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionArray),
      });

      if (!response.ok) {
        throw new Error("Failed to log workout");
      }

      const data = await response.json();
      console.log("Workout logging response:", data);
      alert("Workout data submitted successfully!");
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      alert("Error logging workout data");
    }
  };

  // Capitalize function to format text properly
  const capitalize = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (loading) return <p>Loading workouts...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="Workout">
      <div id="workoutContainer">
        <h1>Today's Workout</h1>
        <hr />
        <div className="workout-list">
          {workouts.length === 0 ? (
            <p>No workouts available.</p>
          ) : (
            workouts.map((workout, index) => (
              <div key={index} className="workout-card">
                <h2>{capitalize(workout.name)}</h2>
                <div className="workout-info">
                  <p><strong>Target:</strong> {capitalize(workout.target)}</p>
                  <p><strong>Intensity:</strong> {workout.Intensity}</p>
                  <p><strong>Weight:</strong> {workout.Weight}</p>
                  <p><strong>Reps:</strong> {workout.Reps}</p>
                  <p><strong>Time:</strong> {workout.Time}</p>
                </div>
                {workout.gifUrl && (
                  <img src={workout.gifUrl} alt={workout.name} className="workout-image" />
                )}
                {workout.instructions && (
                  <ul>
                    {workout.instructions.map((instruction, idx) => (
                      <li key={idx}>{instruction}</li>
                    ))}
                  </ul>
                )}
                {workout.videoUrl && (
                  <a href={workout.videoUrl} target="_blank" rel="noopener noreferrer">
                    Watch Video
                  </a>
                )}
                <div className="workout-inputs">
                  {workout.Reps !== "N/A" ? (
                    <>
                      <label>Completed Sets:</label>
                      <input
                        type="number"
                        name="sets"
                        placeholder="Sets"
                        value={completedInputs[index]?.sets || ""}
                        onChange={(e) => handleInputChange(index, "sets", e.target.value)}
                      />
                      <label>Completed Reps:</label>
                      <input
                        type="number"
                        name="reps"
                        placeholder="Reps"
                        value={completedInputs[index]?.reps || ""}
                        onChange={(e) => handleInputChange(index, "reps", e.target.value)}
                      />
                      {workout.Weight !== "N/A" && (
                        <>
                          <label>Completed Weight:</label>
                          <input
                            type="number"
                            name="weight"
                            placeholder="Weight"
                            value={completedInputs[index]?.weight || ""}
                            onChange={(e) => handleInputChange(index, "weight", e.target.value)}
                          />
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <label>Completed Time (minutes):</label>
                      <input
                        type="number"
                        name="time"
                        placeholder="Time in minutes"
                        value={completedInputs[index]?.time || ""}
                        onChange={(e) => handleInputChange(index, "time", e.target.value)}
                      />
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        <hr />
        <button onClick={handleSubmitWorkout} className="submit-workout-button">
          Submit Completed Workout
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          className="workout-back-button"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Workout;
