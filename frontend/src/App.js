import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Onboarding from "./pages/onboarding";
import Dashboard from "./pages/dashboard";
import Register from "./pages/registerPage";
import FitnessPlan from "./pages/fitnessPlan";
import Workout from "./pages/workout";
import Survey from "./pages/survey";

class App extends Component {

  state = {
    username: "User1234"
  }

  setUsername = (newUsername) => {
    this.setState({ username: newUsername });
    console.log("3", this.state.username);
  };

  render() {
    return (
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard username={this.state.username} />} />
            <Route path="/register" element={<Register setUsername={this.setUsername} />}/>
            <Route path="/fitnessPlan" element={<FitnessPlan />} />
            <Route path="/workout" element={<Workout />} />
            <Route path="/survey" element={<Survey />} />
          </Routes>
        </div>
      </Router>
    );
  }
}

export default App;
