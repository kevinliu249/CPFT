import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Workout.css";

const Workout = () => {
  const navigate = useNavigate();
  // State to store fetched workouts
  const [workouts, setWorkouts] = useState([]);
  // Loading and error state for fetch operation
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State to track the user's input for completed workout metrics
  const [completedInputs, setCompletedInputs] = useState({});

  // useEffect fetches the workouts from the backend on component mount
  useEffect(() => {
    const fetchWorkouts = async () => {
      const username = "test_user"; // Replace with actual username, e.g., from localStorage

      try {
        // Fetch workout data for the user
        const response = await fetch(`http://localhost:5000/workout?username=${username}`);
        if (!response.ok) {
          throw new Error("Failed to fetch workouts");
        }
        const data = await response.json();
        console.log("Fetched data:", data);
        // Set the workouts state with the data returned from the backend
        setWorkouts(Array.isArray(data.workout) ? data.workout : []);
      } catch (error) {
        // Update error state if there's a problem fetching data
        setError(error.message);
      } finally {
        // Once fetch is complete, update the loading state
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  // Function to handle input changes for each workout's completed metrics
  const handleInputChange = (index, field, value) => {
    setCompletedInputs(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: value,
      },
    }));
  };

  // Function to handle the submission of completed workout data
  const handleSubmitWorkout = () => {
    // Currently logs the completed inputs; later integrate with backend endpoint
    console.log("Completed workout data:", completedInputs);
    alert("Workout data submitted! Check console for details.");
  };

  // Display loading or error messages as necessary
  if (loading) return <p>Loading workouts...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="Workout">
      <div id="workoutContainer">
        <h1>Today's Workout</h1>
        <hr />
        <div className="workout-list">
          {Array.isArray(workouts) && workouts.length === 0 ? (
            <p>No workouts available.</p>
          ) : (
            // Map through each workout and render its details along with inputs for completed metrics
            workouts.map((workout, index) => (
              <div key={index} className="workout-card">
                {/* Display workout details */}
                <h2>{workout.name}</h2>
                <p>
                  <strong>Target:</strong> {workout.target}
                </p>
                <p>
                  <strong>Intensity:</strong> {workout.Intensity}
                </p>
                <p>
                  <strong>Weight:</strong> {workout.Weight}
                </p>
                <p>
                  <strong>Reps:</strong> {workout.Reps}
                </p>
                <p>
                  <strong>Time:</strong> {workout.Time}
                </p>
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
                {/* Section for user to input completed workout metrics */}
                <div className="workout-inputs">
                  {workout.Reps !== "N/A" ? (
                    // For strength or flexibility workouts: display inputs for sets, reps, and weight (if applicable)
                    <>
                      {/* Input for completed sets */}
                      <label>Completed Sets:</label>
                      <input
                        type="number"
                        name="sets"
                        placeholder="Sets"
                        value={completedInputs[index]?.sets || ""}
                        onChange={(e) => handleInputChange(index, "sets", e.target.value)}
                      />
                      {/* Input for completed reps */}
                      <label>Completed Reps:</label>
                      <input
                        type="number"
                        name="reps"
                        placeholder="Reps"
                        value={completedInputs[index]?.reps || ""}
                        onChange={(e) => handleInputChange(index, "reps", e.target.value)}
                      />
                      {/* If a weight is applicable, display an input for completed weight */}
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
                    // For cardio workouts (where reps are "N/A"): display an input for time in minutes
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
        {/* Button to submit completed workout data */}
        <button onClick={handleSubmitWorkout} className="submit-workout-button">
          Submit Completed Workout
        </button>
        {/* Button to navigate back to the dashboard */}
        <button onClick={() => navigate("/dashboard")} className="workout-back-button">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Workout;
