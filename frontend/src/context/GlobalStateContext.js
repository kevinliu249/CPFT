import React, { createContext, useState } from "react";

// Create the context
export const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [theme, setTheme] = useState("light"); // State for theme management
  const [user, setUser] = useState(null); // Placeholder for user profile data

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme === "light" ? "dark" : "light");
  };

  return (
    <GlobalStateContext.Provider value={{ theme, toggleTheme, user, setUser }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
