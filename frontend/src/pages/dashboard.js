import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalStateContext } from "../context/GlobalStateContext";
import '../styles/App.css';
import '../styles/Dashboard.css';

const Dashboard = ({ username }) => {
  const navigate = useNavigate();
  const { theme } = useContext(GlobalStateContext);

  return (
    <div className={`Dashboard ${theme}`}>
      <div id="dashboardContainer"> {/* Added container for styling consistency */}
        <h1>Dashboard</h1>
        <h2>Welcome {username}</h2>
        <hr />
        <p>No Pain, No Gainz! You Got This!</p>

        <div className="button-group"> {/* Grouped buttons for consistency */}
          <button onClick={() => navigate("/fitnessPlan")}>Fitness Plan</button>
          <button onClick={() => navigate("/workout")}>Workout</button>
          <button onClick={() => navigate("/survey")}>Take Survey</button>
          <button onClick={() => navigate("/settings")}>Settings</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
