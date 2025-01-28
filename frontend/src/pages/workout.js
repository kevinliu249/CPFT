import React from "react";
// import { useNavigate } from "react-router-dom";
import '../styles/App.css';
import '../styles/Workout.css';
import ThemeToggleButton from "../component/ThemeToggleButton";

const Workout = () => {
  
    return (
      <div className="Workout">
        <p>Workout</p>
        <ThemeToggleButton /> {/* Add the theme toggle button */}
      </div>
    );
  };
  
  export default Workout;