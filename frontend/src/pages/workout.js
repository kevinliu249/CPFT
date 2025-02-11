import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Workout.css";

const Workout = () => {
  const navigate = useNavigate();
  const [workout, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const username = "test_user"; // Replace with actual username, e.g., from localStorage

      try {
        const response = await fetch(`http://localhost:5000/workout?username=${username}`);
        if (!response.ok) {
          throw new Error("Failed to fetch workouts");
        }
        const data = await response.json();
        console.log('Fetched data:', data);  // Log the response data
        setWorkouts(Array.isArray(data.workout) ? data.workout : []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  if (loading) return <p>Loading workouts...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="Workout">
      <div id="workoutContainer">
        <h1>Today's Workout</h1>
        <hr />
        <div className="workout-list">
        {Array.isArray(workout) && workout.length === 0 ? (
            <p>No workouts available.</p>
          ) : (
            workout.map((workout) => (
              <div key={workout.id} className="workout-card">
                <h2>{workout.name}</h2>
                <p><strong>Target:</strong> {workout.target}</p>
                <p><strong>Intensity:</strong> {workout.Intensity}</p>
                <p><strong>Weight:</strong> {workout.Weight}</p>
                <p><strong>Reps:</strong> {workout.Reps}</p>
                <p><strong>Time:</strong> {workout.Time}</p>
                {workout.gifUrl && <img src={workout.gifUrl} alt={workout.name} className="workout-image" />}
                {workout.instructions && (
                  <ul>
                    {workout.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ul>
                )}
                {workout.videoUrl && <a href={workout.videoUrl} target="_blank" rel="noopener noreferrer">Watch Video</a>}
              </div>
            ))
          )}
        </div>
        <hr />
        <button onClick={() => navigate("/dashboard")} className="workout-back-button">Back to Dashboard</button>
      </div>
    </div>
  );
};

export default Workout;