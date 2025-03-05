import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalStateContext } from "../context/GlobalStateContext";
import '../styles/App.css';
import '../styles/Dashboard.css';
import avatar1 from "../images/avatar1.png";
import avatar2 from "../images/avatar2.png";
import avatar3 from "../images/avatar3.png";
import avatar4 from "../images/avatar4.png";

const Dashboard = ({ username, avatarImageNum }) => {
  const navigate = useNavigate();
  const { theme } = useContext(GlobalStateContext);

  const avatars = {
    1: avatar1,
    2: avatar2,
    3: avatar3,
    4: avatar4,
  };

  return (
    <div className={`Dashboard ${theme}`}>
      <div id="dashboardContainer"> {/* Added container for styling consistency */}
        <h1>Dashboard</h1>
        <h2>Welcome {username}</h2>
        <img alt="Avatar" src={avatars[avatarImageNum]}></img>

        <hr />
        <p>No Pain, No Gainz! You Got This!</p>

        <div className="button-group"> {/* Grouped buttons for consistency */}
          <button onClick={() => navigate("/workout")}>Workout</button>
          <button onClick={() => navigate("/editworkout")}>Edit Workout Plan</button>
          <button onClick={() => navigate("/survey")}>Trainer Survey</button>
          <button onClick={() => navigate("/fitnessData")}>Fitness Data</button>
          <button onClick={() => navigate("/settings")}>Settings</button>
          <button onClick={() => navigate("/")}>Log Out</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
