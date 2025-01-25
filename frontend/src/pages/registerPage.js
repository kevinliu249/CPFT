import React from "react";
import { useNavigate } from "react-router-dom";
import '../styles/App.css';
import '../styles/Register.css';

const Register = () => {
  const navigate = useNavigate();

  const loginNavigate = () => {
    navigate("/dashboard");
  };



  return (
    <div className="Register">

      <h1>Register</h1>

      <p>Make a new account and password.</p>
      <label htmlFor="username">Username:</label>
      <input type="text" id="username" name="username" /><br />
      <label htmlFor="password">Password:</label>
      <input type="password" id="password" name="password" /><br />
      <label htmlFor="password">Re-Enter Password:</label>
      <input type="password" id="password" name="password" /><br />
      <button onClick={loginNavigate}>Create Account</button>

    </div>
  );
}
export default Register;