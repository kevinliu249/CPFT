import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";
import "../styles/Survey.css";

const Survey = () => {
  const navigate = useNavigate();
  
  const [surveyData, setSurveyData] = useState({
    goal: "",
    bodyType: "",
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
        <label>Fitness Goal:</label>
        <select name="goal" value={surveyData.goal} onChange={handleChange} required>
          <option value="">Select</option>
          <option value="lose_weight">Lose Weight</option>
          <option value="build_strength">Build Strength</option>
          <option value="endurance">Increase Endurance</option>
          <option value="flexibility">Improve Flexibility</option>
        </select>
        
        <label>Body Type:</label>
        <select name="bodyType" value={surveyData.bodyType} onChange={handleChange} required>
          <option value="">Select</option>
          <option value="endomorph">Endomorph</option>
          <option value="ectomorph">Ectomorph</option>
          <option value="mesomorph">Mesomorph</option>
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