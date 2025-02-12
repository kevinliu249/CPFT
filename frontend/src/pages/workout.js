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
        const response = await fetch(`http://localhost:5000/workout?username=${username}`);
        if (!response.ok) throw new Error("Failed to fetch workouts");

        const data = await response.json();
        console.log("Fetched data:", data);
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

  // Handle form submission
  const handleSubmitWorkout = () => {
    console.log("Completed workout data:", completedInputs);
    alert("Workout data submitted! Check console for details.");
  };

  // Capitalize function to format text properly
  const capitalize = (str) => {
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
                <p><strong>Target:</strong> {capitalize(workout.target)}</p>
                <p><strong>Intensity:</strong> {workout.Intensity}</p>
                <p><strong>Weight:</strong> {workout.Weight}</p>
                <p><strong>Reps:</strong> {workout.Reps}</p>
                <p><strong>Time:</strong> {workout.Time}</p>
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
        <button onClick={() => navigate("/dashboard")} className="workout-back-button">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Workout;
