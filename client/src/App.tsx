import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import StartInterview from "./pages/StartInterview";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

import ProtectedRoute from "./components/ProtectedRoute";

import InterviewSetup from "./pages/InterviewSetup";
import Interview from "./pages/Interview";
import Feedback from "./pages/Feedback";
import InterviewHistory from "./pages/InterviewHistory";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}

        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />


        {/* Protected Routes */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/start-interview"
            element={<StartInterview />}
          />

          <Route
            path="/interview-setup"
            element={<InterviewSetup />}
          />

          <Route
            path="/interview"
            element={<Interview />}
          />

          <Route
            path="/feedback"
            element={<Feedback />}
          />

          {/* Interview History */}

          <Route
            path="/history"
            element={<InterviewHistory />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;