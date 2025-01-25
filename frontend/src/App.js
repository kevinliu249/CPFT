import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Onboarding from "./pages/onboarding";
import Dashboard from "./pages/dashboard";
import Register from "./pages/registerPage";
import FitnessPlan from "./pages/fitnessPlan";
import Workout from "./pages/workout";

class App extends Component {

  state = {
    username: "User1234"
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/fitnessPlan" element={<FitnessPlan />} />
            <Route path="/workout" element={<Workout />} />
          </Routes>
        </div>
      </Router>
    );
  }
}

export default App;
