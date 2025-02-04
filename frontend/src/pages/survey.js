import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    navigate("/fitnessPlan");
  };

  return (
    <div className="Survey">
      <div id="surveyContainer"> {/* Added a container to mirror Register Page */}
        <h1>Fitness Plan Survey</h1>
        <h3>Help us customize your workouts!</h3>
        <hr />
        <form onSubmit={handleSubmit}>
          <label htmlFor="exerciseType">Exercise Type/Goal:</label>
          <select
            id="exerciseType"
            name="exerciseType"
            value={surveyData.exerciseType}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="muscle_mass">Muscle Mass</option>
            <option value="cardio_endurance">Cardio/Endurance</option>
            <option value="flexibility">Flexibility</option>
          </select>

          <label htmlFor="equipmentPreference">Equipment Preference:</label>
          <select
            id="equipmentPreference"
            name="equipmentPreference"
            value={surveyData.equipmentPreference}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="bodyweight">Bodyweight</option>
            <option value="weights">Weights</option>
            <option value="none">None</option>
          </select>

          <label htmlFor="fitnessLevel">Fitness Level:</label>
          <select
            id="fitnessLevel"
            name="fitnessLevel"
            value={surveyData.fitnessLevel}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <div className="button-group"> {/* Wrapped buttons for consistent design */}
            <button type="submit">Submit Survey</button>
          </div>
        </form>
        <h5 onClick={() => navigate("/dashboard")}>
          Want to skip? Go to Dashboard
        </h5>
      </div>
    </div>
  );
};

export default Survey;
