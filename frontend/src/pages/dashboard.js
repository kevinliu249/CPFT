import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalStateContext } from "../context/GlobalStateContext";
import '../styles/App.css';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(GlobalStateContext);

  return (
    <div className={`Dashboard ${theme}`}>
      <h1>Dashboard</h1>
      <p>No workouts needed. You are Fine just the way you are.</p>
      <button onClick={() => navigate("/fitnessPlan")}>Fitness Plan</button>
      <button onClick={() => navigate("/workout")}>Workout</button>
      <button onClick={() => navigate("/survey")}>Take Survey</button>
      <button className="theme-toggle-btn" onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

export default Dashboard;
