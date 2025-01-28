import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";
import "../styles/Onboarding.css";
import picture from "../images/onboarding.png"

const Onboarding = () => {
  const navigate = useNavigate();

  const loginNavigate = () => {
    navigate("/dashboard");
  };

  const registerNaviate = () => {
    navigate("/register");
  };

  return (
    <div className="Onboarding">
      <img src={picture} alt="Onboarding Workout"/>
      <hr></hr>
      <h1>Cross-Platform Personal Trainer Application</h1>
      <h3>An App to Manage all of your Workouts</h3>
      <hr></hr>
      <label htmlFor="username">Username:</label>
      <input type="text" id="username" name="username" /><br />
      <label htmlFor="password">Password:</label>
      <input type="password" id="password" name="password" /><br />
      <hr></hr>
      <button onClick={loginNavigate}>Login</button>

      <button onClick={registerNaviate}>New User? <br></br>Click to Register</button>
    </div>
  );
};

export default Onboarding;