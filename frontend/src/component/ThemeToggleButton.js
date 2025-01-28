import React, { useContext } from "react";
import { GlobalStateContext } from "../context/GlobalStateContext";
import "../styles/Dashboard.css"; // Reuse the existing CSS styles

const ThemeToggleButton = () => {
  const { toggleTheme } = useContext(GlobalStateContext);

  return (
    <button className="theme-toggle-btn" onClick={toggleTheme}>
      Toggle Theme
    </button>
  );
};

export default ThemeToggleButton;