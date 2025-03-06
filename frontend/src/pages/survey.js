import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Survey.css";

// Define the options for each dropdown in the survey form.
// This centralizes the configuration of the select inputs.
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
    { value: "weights", label: "Weights / Machines" },
    { value: "none", label: "None" },
  ],
  fitnessLevel: [
    { value: "", label: "Select" },
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ],
};

// Now the Survey component accepts a dynamic username as a prop.
const Survey = ({ username }) => {
  // useNavigate hook used for navigation between routes.
  const navigate = useNavigate();

  // surveyData state holds the values for the three dropdowns.
  const [surveyData, setSurveyData] = useState({
    exerciseType: "",
    equipmentPreference: "",
    fitnessLevel: "",
  });

  // handleChange updates the surveyData state when a user selects an option.
  const handleChange = ({ target: { name, value } }) => {
    // Update the corresponding field in surveyData using the previous state.
    setSurveyData((prevData) => ({ ...prevData, [name]: value }));
  };

  // handleSubmit is called when the survey form is submitted.
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior.

    // Prepare the payload to be sent to the backend.
    // Replace the hard-coded "test_user" with the dynamic username passed in as a prop.
    const surveyPayload = {
      user_name: username, // Dynamic username from props.
      fitness_goal: surveyData.exerciseType,
      fitness_level: surveyData.fitnessLevel,
      equipment_preference: surveyData.equipmentPreference,
    };

    // Attempt to send the survey data to the backend server.
    try {
      const response = await fetch("https://cpft-a9479a55d4c6.herokuapp.com//survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(surveyPayload),
      });

      const data = await response.json();
      if (response.ok) {
        // If the response is OK, log the success and navigate to the dashboard.
        console.log("Survey submitted successfully:", data);
        navigate("/dashboard");
      } else {
        // If the response contains an error, log the error message.
        console.error("Error submitting survey:", data.message);
      }
    } catch (error) {
      // Catch and log any network or unexpected errors.
      console.error("Request failed:", error);
    }
  };

  // Render the survey form with three dropdowns and a submit button.
  return (
    <div className="Survey">
      <div id="surveyContainer">
        {/* Survey Heading */}
        <h1>Training Plan Survey</h1>
        <h3>Let's customize your workouts!</h3>
        {/* Display the logged-in username dynamically if available */}
        {username && <p>Logged in as: {username}</p>}
        <hr />
        <form onSubmit={handleSubmit}>
          {/* Dropdown for selecting Exercise Type/Goal */}
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

          {/* Dropdown for selecting Equipment Preference */}
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

          {/* Dropdown for selecting Fitness Level */}
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

          {/* Submit button for the form */}
          <div className="button-group">
            <button type="submit">Submit Survey</button>
          </div>
        </form>
        {/* Option to skip the survey and go directly to the Dashboard */}
        <h5 onClick={() => navigate("/dashboard")}>
          Want to skip? Go to Dashboard
        </h5>
      </div>
    </div>
  );
};

export default Survey;
