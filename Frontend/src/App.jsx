import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./Components/ErrorBoundary";

// Import các components
import MemberDashBoard from "./pages/MemberPages/Home";
import Login from "./pages/MemberPages/Login";
import Register from "./pages/MemberPages/Register";
import MemberHomePage from "./pages/MemberPages/MemberHomePage";
import MemberProfile from "./pages/MemberPages/MemberProfile";
import ChangePassword from "./pages/MemberPages/ChangePassword";
import Feedback from "./pages/MemberPages/Feedback";
import SchedulePage from "./pages/MemberPages/SchedulePage";
import RegisterPackage from "./pages/MemberPages/RegisterPackage";
import TrainerHome from "./pages/TrainerPages/TrainerHome";
import TrainerMembersList from "./pages/TrainerPages/TrainerMembersList";
import TrainerProfileEdit from "./pages/TrainerPages/TrainerProfileEdit";
import AdminDashboard from "./pages/AdminPages/AdminDashboard";
import ReceptionistDashboard from "./pages/ReceptionistPages/ReceptionistDashboard";
import EquipmentStatistics from "./pages/ReceptionistPages/EquipmentStatistics";
import RevenueStatistics from "./pages/ReceptionistPages/RevenueStatistics";
import ReceptionistProfile from "./pages/ReceptionistPages/ReceptionistProfile";
import MembershipApproval from "./pages/ReceptionistPages/MembershipApproval";
import TransactionHistory from './pages/MemberPages/TransactionHistory';

function App() {
  const appStyles = {
    app: {
      fontFamily: "Poppins, sans-serif",
      backgroundColor: "#111317",
      minHeight: "100vh",
      background:
        "radial-gradient(circle, rgba(249, 172, 84, 0.3) 0%, rgba(15, 15, 15, 0.95) 70%, #111317 100%)",
    },
  };

  return (
    <ErrorBoundary>
      <Router>
        <div style={appStyles.app}>
          <Routes>
            {/* Member Routes */}
            <Route path="/homepage" element={<MemberDashBoard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/member/home" element={<MemberHomePage />} />
            <Route path="/member/profile" element={<MemberProfile />} />
            <Route
              path="/member/change-password"
              element={<ChangePassword />}
            />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/packages" element={<RegisterPackage />} />
            <Route path="/transactions" element={<TransactionHistory />} />
            {/* Receptionist Routes */}
            <Route path="/receptionist" element={<ReceptionistDashboard />}>
              <Route path="profile" element={<ReceptionistProfile />} />
              <Route path="revenue" element={<RevenueStatistics />} />
              <Route path="equipment" element={<EquipmentStatistics />} />
              <Route
                path="membership-approval"
                element={<MembershipApproval />}
              />
            </Route>
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            {/* Trainer Routes */}
            <Route path="/trainer/home" element={<TrainerHome />}>
              <Route
                index
                element={
                  <div style={{ color: "#fff", padding: "2rem" }}>
                    Welcome Trainer Home
                  </div>
                }
              />
              <Route path="members" element={<TrainerMembersList />} />
              <Route path="profile/edit" element={<TrainerProfileEdit />} />
            </Route>
            {/* Default Route */}
            <Route path="/" element={<MemberDashBoard />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
