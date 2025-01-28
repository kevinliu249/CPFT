import React from "react";
// import { useNavigate } from "react-router-dom";
import '../styles/App.css';
import '../styles/FitnessPlan.css';
import ThemeToggleButton from '../component/ThemeToggleButton';

const FitnessPlan = () => {
  
    return (
      <div className="FitnessPlan">
        <p>FitnessPlan</p>
        <ThemeToggleButton /> {/* Add the theme toggle button */}
      </div>
    );
  };
  
  export default FitnessPlan;