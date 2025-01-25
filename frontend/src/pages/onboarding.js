import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";
import "../styles/Onboarding.css";

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
      <h1>Onboarding Screen</h1>
      <label htmlFor="username">Username:</label>
      <input type="text" id="username" name="username" /><br />
      <label htmlFor="password">Password:</label>
      <input type="password" id="password" name="password" /><br />
      <button onClick={loginNavigate}>Click to Login to Dashboard Page</button>

      <button onClick={registerNaviate}>New User? Click to Register</button>
    </div>
  );
};

export default Onboarding;