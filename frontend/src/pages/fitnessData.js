// FitnessData.js
import React, { useEffect, useState } from "react";
import "../styles/Workout.css"; 
// Import the components from react-chartjs-2
import { Bar } from "react-chartjs-2";
import 'chart.js/auto';

const FitnessData = ({ username }) => {
  // State to hold your fetched metrics
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch placeholder metrics on component mount
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/metrics/${username}`);
        if (!response.ok) {
          throw new Error("Failed to fetch metrics");
        }
        const data = await response.json();
        setMetrics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [username]);

  if (loading) return <p>Loading user metrics...</p>;
  if (error) return <p>Error: {error}</p>;

  // Prepare data for bar chart comparisons, e.g. Highest Reps vs. Last Reps, Highest Volume vs. Last Volume
  const repsData = {
    labels: ["Highest Reps", "Last Reps"],
    datasets: [
      {
        label: "Reps Comparison",
        data: [metrics.highestReps, metrics.lastReps],
        backgroundColor: ["#36A2EB", "#FFCE56"],
      },
    ],
  };

  const volumeData = {
    labels: ["Highest Volume", "Last Volume"],
    datasets: [
      {
        label: "Volume Comparison",
        data: [metrics.highestVolume, metrics.lastVolume],
        backgroundColor: ["#4BC0C0", "#FF6384"],
      },
    ],
  };

  // Example numeric data for cardio/time & session count
  const totalTime = metrics.totalCardioTime;  // e.g. minutes
  const sessionCount = metrics.sessionCount; 

  return (
    <div className="fitness-data-container">
      <h2>Fitness Data for {username}</h2>

      {/* Numeric stats section */}
      <div className="stats-numbers">
        <div className="stat-item">
          <h3>Highest Reps</h3>
          <p>{metrics.highestReps}</p>
        </div>
        <div className="stat-item">
          <h3>Last Reps</h3>
          <p>{metrics.lastReps}</p>
        </div>
        <div className="stat-item">
          <h3>Highest Volume</h3>
          <p>{metrics.highestVolume}</p>
        </div>
        <div className="stat-item">
          <h3>Last Volume</h3>
          <p>{metrics.lastVolume}</p>
        </div>
        <div className="stat-item">
          <h3>Total Cardio Time (min)</h3>
          <p>{totalTime}</p>
        </div>
        <div className="stat-item">
          <h3>Total Sessions</h3>
          <p>{sessionCount}</p>
        </div>
      </div>

      {/* Bar chart examples */}
      <div className="chart-container">
        <h3>Reps Comparison</h3>
        <Bar data={repsData} />
      </div>

      <div className="chart-container">
        <h3>Volume Comparison</h3>
        <Bar data={volumeData} />
      </div>
    </div>
  );
};

export default FitnessData;
