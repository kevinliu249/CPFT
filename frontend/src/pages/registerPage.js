import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/App.css';
import '../styles/Register.css';
import avatar1 from "../images/avatar1.png";
import avatar2 from "../images/avatar2.png";
import avatar3 from "../images/avatar3.png";
import avatar4 from "../images/avatar4.png";

const Register = ({ setUsername }) => {
  let avatarSelection = 1;
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
    // The following code sends an array of user entered [Email, Username, Password, Avatar Image Number] to the Backend
    // Backend should return True if the account was created
    // Otherwise it should return False if the email is already registered
    const accountData = [document.getElementById("email").value, document.getElementById("username").value, document.getElementById("password1").value, avatarSelection];
    try {
      const response = await fetch("http://localhost:3000/registering", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(accountData),
      });
      console.log(accountData)
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
      errorDisplay("Please enter a valid username.");
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(document.getElementById("email").value)) {
      errorDisplay("Please enter a valid email.");
      return
    }
    sendData();
  };

  const selectAvatar = (number) => {
    // Changes the class names on avatar image divs to showcase which is currently selected
    avatarSelection = number;
    for (let i = 1; i < document.getElementById("avatar-Container").getElementsByTagName("div").length + 1; i++) {
      document.getElementById("image" + i).className = "";
    }
    document.getElementById("image" + number).className = "selected";
  }

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

        <label htmlFor="avatar">Select Avatar:</label>
        <div id="avatar-Container">
          <div id="image1" className="selected" onClick={() => selectAvatar(1)}><img src={avatar1} alt="Avatar 1"></img></div>
          <div id="image2"                      onClick={() => selectAvatar(2)}><img src={avatar2} alt="Avatar 2"></img></div>
          <div id="image3"                      onClick={() => selectAvatar(3)}><img src={avatar3} alt="Avatar 3"></img></div>
          <div id="image4"                      onClick={() => selectAvatar(4)}><img src={avatar4} alt="Avatar 4"></img></div>
        </div>
        <hr />
        <div className="button-group">
          <button onClick={validateCreateAccount}>Sign Up</button>
        </div>
        <h5 onClick={onBoardingNavigate}>Already have an account? Click to sign in!</h5>
      </div>
    </div>
  );
}
export default Register;