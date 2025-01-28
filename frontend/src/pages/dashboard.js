import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalStateContext } from "../context/GlobalStateContext";
import '../styles/App.css';
import '../styles/Dashboard.css';
import ThemeToggleButton from "../component/ThemeToggleButton";

const Dashboard = () => {
  const navigate = useNavigate();
  const { theme } = useContext(GlobalStateContext);

  return (
    <div className={`Dashboard ${theme}`}>
      <h1>Dashboard</h1>
      <p>No workouts needed. You are Fine just the way you are.</p>
      <button onClick={() => navigate("/fitnessPlan")}>Fitness Plan</button>
      <button onClick={() => navigate("/workout")}>Workout</button>
      <button onClick={() => navigate("/survey")}>Take Survey</button>
      <ThemeToggleButton /> {/* Add the theme toggle button */}
    </div>
  );
};

export default Dashboard;
