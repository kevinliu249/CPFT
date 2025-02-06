import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/App.css';
import '../styles/Register.css';

const Register = ({ setUsername }) => {
  const [setResponseData] = useState(null);

  const navigate = useNavigate();

  const onBoardingNavigate = () => {
    navigate("/");
  };

  const errorDisplay = (str) => {
    // Displays a red window above the input fields with given error messages to the user
    document.getElementById("errorWindow").style.display = "block";
    document.getElementById("errorWindow").innerHTML = str;
  }

  const validatePassword = (pass1, pass2) => {
    // Checks if passwords are too short, or do not match each other
    if (pass1.split("").length <= 8 ) {
      errorDisplay("Your Passwords are too short!");
      document.getElementById("password1").value = ""
      document.getElementById("password2").value = ""
      return false;
    }
    if (pass1 !== pass2) {
      errorDisplay("Your Passwords do not match!");
      document.getElementById("password1").value = ""
      document.getElementById("password2").value = ""
      return false;
    }
    return true;
  }

  const sendData = async () => {
    // The following code sends an array of [Email, Username, Password] to the Backend
    // Backend should return True if the account was created
    // Otherwise it should return False if the email is already registered
    const accountData = [document.getElementById("email").value, document.getElementById("username").value, document.getElementById("password1").value];
    try {
      const response = await fetch("http://localhost:3000/backend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(accountData),
      });
      if (!response.ok) {
        errorDisplay("There was a problem reaching the Backend");
        throw new Error("There was a problem reaching the Backend");
      }
      // Got a response from backend
      const backendResponse = await response.json();
      setResponseData(backendResponse);
      console.log(backendResponse);
      if (backendResponse) {
        // Successfully Created Account! Redirect user to Dashboard page
        setUsername(document.getElementById("username").value);
        navigate("/dashboard");
      } else {
        errorDisplay("That Email is already registered for an account.")
      }
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  };

  const validateCreateAccount = () => {
    // This function will check all the required fields for valid data. 
    // If it passes, it gets sent to the backend for another check and account registration.
    if (!validatePassword(document.getElementById("password1").value, document.getElementById("password2").value)) {
      return
    }
    if (!document.getElementById("username").value) {
      errorDisplay(" Nothing entered in username field!");
      return
    }
    if (!document.getElementById("email").value) {
      errorDisplay(" Nothing entered in email field!");
      return
    }
    sendData();
  };

  return (
    <div className="Register">
      <div id="registercontainer">
        <h1>Sign Up</h1>

        <div id="errorWindow">
          <span id="errorWindowText"></span>
        </div>

        <label htmlFor="username">Username:</label>
        <input type="text" id="username" name="username" /><br />
        <label htmlFor="email">Email:</label>
        <input type="text" id="email" name="email" /><br />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password1" name="password1" /><br />
        <label htmlFor="password">Re-Type Password:</label>
        <input type="password" id="password2" name="password2" /><br />
        <hr />
        <div className="button-group">
          <button onClick={validateCreateAccount}>Sign Up</button>
        </div>
        <h5 onClick={onBoardingNavigate}>Already have an account? Click to sign in!</h5>
      </div>

      <ThemeToggleButton /> {/* Add the theme toggle button */}
      
    </div>
  );
}
export default Register;