import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";
import "../styles/Survey.css";

const Survey = () => {
    const navigate = useNavigate();
    
    const [surveyData, setSurveyData] = useState({
      exerciseType: "",
      equipmentPreference: "",
      fitnessLevel: "",
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setSurveyData({ ...surveyData, [name]: value });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Survey submitted:", surveyData);
      // Redirect to fitness plan page after submission
      navigate("/fitnessPlan");
    };
  
    return (
      <div className="Survey">
        <h1>Fitness Plan Survey</h1>
        <form onSubmit={handleSubmit}>
          <label>Exercise Type/Goal:</label>
          <select name="exerciseType" value={surveyData.exerciseType} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="muscle_mass">Muscle Mass</option>
            <option value="cardio_endurance">Cardio/Endurance</option>
            <option value="flexibility">Flexibility</option>
          </select>
          
          <label>Equipment Preference:</label>
          <select name="equipmentPreference" value={surveyData.equipmentPreference} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="bodyweight">Bodyweight</option>
            <option value="weights">Weights</option>
          </select>
  
          <label>Fitness Level:</label>
          <select name="fitnessLevel" value={surveyData.fitnessLevel} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          
          <button type="submit">Submit Survey</button>
        </form>
      </div>
    );
  };
  
  export default Survey;
  