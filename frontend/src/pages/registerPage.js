import React from "react";
import { useNavigate } from "react-router-dom";
import '../styles/App.css';
import '../styles/Register.css';
import ThemeToggleButton from '../component/ThemeToggleButton';

const Register = ({ setUsername }) => {
  const navigate = useNavigate();

  const onBoardingNavigate = () => {
    navigate("/");
  };

  const errorDisplay = (str) => {
    let ele = document.getElementById("errorWindow");
    ele.style.display = "block";
    ele.innerHTML = str;
  }

  const validatePassword = (pass1, pass2) => {
    if (pass1.split("").length < 7 ) {
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

  const validateCreateAccount = () => {
    if (!validatePassword(document.getElementById("password1").value, document.getElementById("password2").value)) {
      // Two Entered Passwords do not Match
      return

    } else{
      // Passwords Match
      let tmpBackendResponse = true;

      // TODO
      // Code that sends the Username, Email, Password, to the BackEnd
      // Should return True if the account was created,
      // Otherwise return False if the email is already registered

      if (tmpBackendResponse) {
        // Succuessful Create Account!
        console.log("1")
        setUsername(document.getElementById("username").value);
        console.log("2")
        navigate("/dashboard");
      } else {
        errorDisplay("That Email is already registered for an account.")
      }
    }
  };

  return (
    <div className="Register">
      <div id="registercontainer">
        <h1>Sign Up</h1>

        <div id="errorWindow">
          <span id="errorWindowText">There was a problem!</span>
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
        {/* Wrapped Buttons to Stack Buttons Vertically */}
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