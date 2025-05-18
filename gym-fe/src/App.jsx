import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import ReceptionistDashboard from './pages/receptionist/ReceptionistDashboard';
import Member from './pages/receptionist/Member';
import CheckInCheckOut from './pages/receptionist/CheckInCheckOut';
import MaintenanceRequests from './pages/receptionist/MaintenanceRequests';
import EquipmentList from './pages/receptionist/EquipmentList';
import MembershipActions from './pages/receptionist/MembershipActions';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang đăng nhập */}
        <Route path="/login" element={<Login />} />

        {/* Trang dashboard dành cho receptionist */}
        <Route path="/receptionist/dashboard" element={<ReceptionistDashboard />} />

        <Route path="/receptionist/members" element={<Member />} />

        <Route path="/receptionist/checkin-checkout" element={<CheckInCheckOut />} />

        <Route path="/receptionist/maintenance-requests" element={<MaintenanceRequests />} />

        <Route path="/receptionist/equipments" element={<EquipmentList />} />

        <Route path="/receptionist/memberships" element={<MembershipActions />} />

        {/* Mặc định redirect tới login */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
