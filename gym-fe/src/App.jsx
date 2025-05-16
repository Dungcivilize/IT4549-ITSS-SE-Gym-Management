import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import ReceptionistDashboard from './pages/receptionist/ReceptionistDashboard';
import Member from './pages/receptionist/Member';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang đăng nhập */}
        <Route path="/login" element={<Login />} />

        {/* Trang dashboard dành cho receptionist */}
        <Route path="/receptionist/dashboard" element={<ReceptionistDashboard />} />

        <Route path="/receptionist/members" element={<Member />} />
        
        {/* Mặc định redirect tới login */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
