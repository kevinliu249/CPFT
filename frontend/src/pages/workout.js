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
        const response = await fetch(`http://localhost:5000/workout?username=${username}`);
        if (!response.ok) throw new Error("Failed to fetch workouts");

        const data = await response.json();
        console.log("Fetched data:", data);
        // "workouts" should be an array with 2 exercies.
        // If the data has workout: array, store it, otherwise store an empty array.
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

/* 
  NEW: handleSubmitWorkout:
  1. transforms completed inputs into an array of objects that match Kevins Format
  2. POST it to /workout?username=..l
  3. Backend should log each exercise to workoutlogs in mongo
  */
  const handleSubmitWorkout = async () => {
    // For convenience, log the local state
    console.log("Completed workout data:", completedInputs);
    // Builds expected array
    const submissionArray = workouts.map((_, idx) => {
      return {
        sets: completedInputs[idx]?.sets || null,
        reps: completedInputs[idx]?.reps || null,
        weight: completedInputs[idx]?.weight || null,
        time: completedInputs[idx]?.time || null,
      };
    });
    // POST to "/workout" endpoint with the username as query param
    try {
      const response = await fetch(`http://localhost:5000/workout?username=${username}`, {
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
        {/* Clicking this will trigger our POST request */}
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