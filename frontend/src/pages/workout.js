import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Workout.css";

const Workout = () => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);

  // Placeholder API call - will be replaced with a real backend API
  useEffect(() => {
    const fetchWorkouts = async () => {
      // Simulating API response structure
      const data = [
        {
          id: 1,
          name: "Bench Press",
          weight: "100 lbs",
          reps: 10,
          sets: 3,
          videoUrl: "https://example.com/benchpress-video",
          imageUrl: "https://example.com/benchpress.jpg",
        },
        {
          id: 2,
          name: "Squat",
          weight: "150 lbs",
          reps: 8,
          sets: 4,
          videoUrl: "https://example.com/squat-video",
          imageUrl: "https://example.com/squat.jpg",
        },
      ];
      setWorkouts(data);
    };

    fetchWorkouts();
  }, []);

  return (
    <div className="Workout">
      <div id="workoutContainer"> {/* Mirroring Register Page styling */}
        <h1>Today's Workout</h1>
        <hr />
        <div className="workout-list">
          {workouts.map((workout) => (
            <div key={workout.id} className="workout-card">
              <h2>{workout.name}</h2>
              <p><strong>Weight:</strong> {workout.weight}</p>
              <p><strong>Reps:</strong> {workout.reps}</p>
              <p><strong>Sets:</strong> {workout.sets}</p>
              {workout.imageUrl && <img src={workout.imageUrl} alt={workout.name} className="workout-image" />}
              {workout.videoUrl && <a href={workout.videoUrl} target="_blank" rel="noopener noreferrer">Watch Video</a>}
            </div>
          ))}
        </div>
        <hr />
        <button onClick={() => navigate("/dashboard")} className="workout-back-button">Back to Dashboard</button>
      </div>
    </div>
  );
};

export default Workout;