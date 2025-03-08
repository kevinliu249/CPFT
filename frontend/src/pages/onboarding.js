import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";
import "../styles/Onboarding.css";
import picture from "../images/onboarding.png";

const Onboarding = ({ setLogin, setAvatar }) => {
  const [responseData, setResponseData] = useState(null);

  const navigate = useNavigate();

  const loginNavigate = () => {
    navigate("/dashboard");
  };

  const registerNavigate = () => {
    navigate("/register");
  };

  const error = () => {
    // Displays when a user enters any incorrect information
    document.getElementById("errorMessage").style.display = "block";
  }

  const validateLogin = async () => {
    console.log("Validating Login called");
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log("Login clicked. Inputs:", { email, password });

    if (!email || !password) {
        console.log("Invalid missing email or Password!");
        error();
        return;
    }
    // The following code sends an array of user entered [Email, Password] to the Backend
    // Backend should return True if the account credentials matched, along with all of the account's workout information to then be stored in the state
    // Otherwise it should return False if the login was invalid
    const accountData = [email, password];
    console.log("Sending accountData:", accountData);    
    try {
      const response = await fetch("https://cpft-a9479a55d4c6.herokuapp.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(accountData),
      });
      if (!response.ok) {
        throw new Error("There was a problem reaching the Backend");
      }
      console.log("Login response status:", response.status);

      if (!response.ok) {
        console.log("Response not OK - showing error");
        error();
        return;
      }
      // Got a response from backend
      const backendResponse = await response.json();
      // setResponseData(backendResponse);
      console.log("Backend response:", backendResponse);
      if (backendResponse.success) {
        // Successfully Logged In! Set up user informatin in state. Redirect user to Dashboard page
        // TODO:
        // set state for fetched user Workout Cards
        console.log("Login sucessful")
        setLogin(backendResponse.username);
        setAvatar(backendResponse.avatar);
        navigate("/dashboard");
      } else {
        throw new Error("There was a problem reaching the Backend");
      }
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }

  return (
    <div className="Onboarding">
      <img src={picture} alt="Onboarding Workout" />
      <hr />
      <h1>Cross-Platform Personal Trainer Application</h1>
      <h3>A Daily Workout Personalized For You!</h3>
      <hr />
      {/* Only shows if there is an error */}
      <span id="errorMessage">Invalid Email or Password!</span>
      <label htmlFor="email">Email:</label>
      <input type="text" id="email" name="email" /><br />
      <label htmlFor="password">Password:</label>
      <input type="password" id="password" name="password" /><br />
      <hr />

      <div className="button-group">
        <button onClick={validateLogin}>Login</button>
        <button onClick={registerNavigate}>New User? <br />Click to Register</button>
        {/* Button only for development of the App for ease of use. Will not be in live production. */}
        <button onClick={loginNavigate}>(Dev) Force Login</button>
      </div>

      <footer>
        <ul>
          <li>Elliot Clark</li>
          <li>Steven Pamplin</li>
          <li>Joon Kang</li>
          <li>Kevin Liu</li>
        </ul>
        <ul>
          <li>Oregon State University</li>
          <li>CS 467 Winter</li>
          <li>Online Capstone Project</li>
          <li>&copy; 2025</li>
        </ul>
      </footer>
    </div>
  );
};

export default Onboarding;