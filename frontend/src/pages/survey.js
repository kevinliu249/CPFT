import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Survey.css";

const selectOptions = {
  exerciseType: [
    { value: "", label: "Select" },
    { value: "muscle_mass", label: "Muscle Mass" },
    { value: "cardio_endurance", label: "Cardio/Endurance" },
    { value: "flexibility", label: "Flexibility" },
  ],
  equipmentPreference: [
    { value: "", label: "Select" },
    { value: "bodyweight", label: "Bodyweight" },
    { value: "weights", label: "Weights" },
    { value: "none", label: "None" },
  ],
  fitnessLevel: [
    { value: "", label: "Select" },
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ],
};

const Survey = () => {
  const navigate = useNavigate();
  const [surveyData, setSurveyData] = useState({
    exerciseType: "",
    equipmentPreference: "",
    fitnessLevel: "",
  });

  const handleChange = ({ target: { name, value } }) => {
    setSurveyData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const surveyPayload = {
      user_name: "test_user", // Replace this with actual logged-in user data
      fitness_goal: surveyData.exerciseType,
      fitness_level: surveyData.fitnessLevel,
      equipment_preference: surveyData.equipmentPreference,
    };

    try {
      const response = await fetch("http://localhost:5000/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(surveyPayload),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Survey submitted successfully:", data);
        navigate("/dashboard");
      } else {
        console.error("Error submitting survey:", data.message);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  return (
    <div className="Survey">
      <div id="surveyContainer">
        <h1>Training Plan Survey</h1>
        <h3>Let's customize your workouts!</h3>
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
            {selectOptions.exerciseType.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <label htmlFor="equipmentPreference">Equipment Preference:</label>
          <select
            id="equipmentPreference"
            name="equipmentPreference"
            value={surveyData.equipmentPreference}
            onChange={handleChange}
            required
          >
            {selectOptions.equipmentPreference.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <label htmlFor="fitnessLevel">Fitness Level:</label>
          <select
            id="fitnessLevel"
            name="fitnessLevel"
            value={surveyData.fitnessLevel}
            onChange={handleChange}
            required
          >
            {selectOptions.fitnessLevel.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="button-group">
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
