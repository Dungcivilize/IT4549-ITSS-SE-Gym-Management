import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./components/Home"; // Đường dẫn đến Home.js
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import MemberHomePage from "./components/MemberHomePage";
import PackageList from "./components/PackageList"; 
import MemberProfile from "./pages/MemberProfile";
import ChangePassword from "./pages/ChangePassword";
import Feedback from "./pages/Feedback";
import Promotion from "./pages/Promotion";

// Bảo vệ route yêu cầu đăng nhập
const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/member-home"
          element={
            <ProtectedRoute>
              <MemberHomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/packages"
          element={
            <ProtectedRoute>
              <PackageList />
            </ProtectedRoute>
          }
        />
        <Route path="/member-profile" element={<MemberProfile />} />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feedback"
          element={
            <ProtectedRoute>
              <Feedback />
            </ProtectedRoute>
          }
        />
        <Route
          path="/promotion"
          element={
            <ProtectedRoute>
              <Promotion />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
