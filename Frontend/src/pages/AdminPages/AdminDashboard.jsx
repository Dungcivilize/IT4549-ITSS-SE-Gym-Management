import React, { useState } from 'react';
import { removeUser } from '../../utils/auth';
import Sidebar from '../../Components/Sidebar'; 
import Dashboard from './Dashboard';
import StaffManagement from './StaffManagement';
import GymRooms from './GymRooms';
import Equipment from './Equipment';
import PackageManagement from './PackageManagement';

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
          removeUser();
          window.location.href = '/login';
        }
        return null;
      default:
        return <h2>Chọn một mục</h2>;
    }
  };

  return (
  <div style={{ display: 'flex', minHeight: '100vh' }}>
    <Sidebar selectedPage={selectedPage} onSelectPage={setSelectedPage} />
    <div
      style={{
        flex: 1,
        padding: '30px',
        background: 'linear-gradient(to bottom right, #e0f7fa, #80deea)',
        color: '#333',
        minHeight: '100vh',
      }}
    >
      {renderContent()}
    </div>
  </div>
);



}
export default AdminDashboard;
