import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Onboarding from "./pages/onboarding";
import Dashboard from "./pages/dashboard";
import Register from "./pages/registerPage";
import FitnessData from "./pages/fitnessData";
import Workout from "./pages/workout";
import Survey from "./pages/survey";
import Settings from "./pages/settings";
import EditWorkout from "./pages/EditWorkout";

class App extends Component {

  state = {
    username: "test_user",
    userAvatar: "1",
    userData: ""
  }

  setUsername = (newUsername) => {
    this.setState({ username: newUsername });
  };

  setAvatar = (avatarNum) => {
    this.setState({ userAvatar: avatarNum });
  };

  setLogin = (username, userData) => {
    this.setState({ username: username});
    this.setState({ userData: userData});
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Onboarding setLogin={this.setLogin} setAvatar={this.setAvatar}/>} />
            <Route path="/dashboard" element={<Dashboard username={this.state.username} avatarImageNum={this.state.userAvatar} />} />
            <Route path="/register" element={<Register setUsername={this.setUsername} setAvatar={this.setAvatar} />}/>
            <Route path="/fitnessData" element={<FitnessData />} />
            <Route path="/workout" element={<Workout username={this.state.username}/>} />
            <Route path="/survey" element={<Survey username={this.state.username} />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/editworkout" element={<EditWorkout username={this.state.username} />} />
          </Routes>
        </div>
      </Router>
    );
  }
}

export default App;
