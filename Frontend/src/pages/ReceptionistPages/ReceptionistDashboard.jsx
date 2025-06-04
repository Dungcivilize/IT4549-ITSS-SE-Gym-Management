import { Outlet } from "react-router-dom"; 
import ReceptionistNav from "../../Components/ReceptionistNav";
import './receptionist.css';

const ReceptionistDashboard = () => {
  return (
    <div className="receptionist-dashboard min-h-screen font-poppins">
      <div className="container">
        <header className="dashboard-header">
          <h1>Receptionist Dashboard</h1>
          <p>Quản lý hệ thống phòng gym</p>
        </header>

        <ReceptionistNav />

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
