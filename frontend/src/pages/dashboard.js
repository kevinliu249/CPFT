import React from "react";
import { useNavigate } from "react-router-dom";
import '../styles/App.css';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();

    const fitnessPlan = () => {
        navigate("/fitnessPlan");
    };

    const workout = () => {
        navigate("/workout");
    };
  
    return (
      <div className="Dashboard">
        <h1>DashBoard</h1>
        <p>No workouts needed. You are Fine just the way you are.</p>
        <button onClick={fitnessPlan}>Fitness Plan</button>
        <button onClick={workout}>Workout</button>
        <button onClick={() => navigate("/survey")}>Take Fitness Survey</button>
      </div>
    );
  };
  
  export default Dashboard;