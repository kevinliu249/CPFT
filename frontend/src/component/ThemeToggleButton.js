import React, { useContext } from "react";
import { GlobalStateContext } from "../context/GlobalStateContext";
import "../styles/App.css"; // Reuses the existing CSS styles

const ThemeToggleButton = () => {
  const { toggleTheme } = useContext(GlobalStateContext);

  return (
    <button className="theme-toggle-btn" onClick={toggleTheme}>
      Toggle Theme
    </button>
  );
};

export default ThemeToggleButton;