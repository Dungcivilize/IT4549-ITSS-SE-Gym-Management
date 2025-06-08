import React, { useState } from 'react';
import Sidebar from '../../Components/Sidebar'; 
import Dashboard from './Dashboard';
import StaffManagement from './StaffManagement';
import GymRooms from './GymRooms';
import Equipment from './Equipment';
import PackageManagement from './PackageManagement';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [selectedPage, setSelectedPage] = useState('Dashboard');

  const renderContent = () => {
    switch (selectedPage) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Staff Management':
        return <StaffManagement />;
      case 'Gym Rooms':
        return <GymRooms />;
      case 'Equipment':
        return <Equipment />;
      case 'Package Management':
        return <PackageManagement />;
      case 'Logout':
        const confirmed = window.confirm('Bạn có chắc chắn muốn đăng xuất?');
        if (confirmed) {
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return null;
      default:
        return <h2>Chọn một mục</h2>;
    }
  };

  return (
    <div className="admin-dashboard">
      <Sidebar selectedPage={selectedPage} onSelectPage={setSelectedPage} />
      <div className="admin-dashboard-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;