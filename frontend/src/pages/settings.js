import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Settings.css";
import { GlobalStateContext } from "../context/GlobalStateContext";

const Settings = () => {
  const navigate = useNavigate();
  const { toggleTheme, theme } = useContext(GlobalStateContext);

  return (
    <div className="Settings">
      <div id="settingsContainer"> {/* Mirroring Register Page styling */}
        <h1>Settings</h1>
        <hr />

        <label>Theme:</label>
        <button onClick={toggleTheme}>
          Toggle Theme (Current: {theme})
        </button>
        
        <hr />
        <h5 onClick={() => navigate("/dashboard")}>Back to Dashboard</h5>
      </div>
    </div>
  );
};

export default Settings;
