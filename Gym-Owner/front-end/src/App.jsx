import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import StaffManagement from './components/StaffManagement';
import GymRooms from './pages/GymRooms';


const App = () => {
  const [selectedPage, setSelectedPage] = useState('Dashboard');

  const renderPage = () => {
    switch (selectedPage) {
      case 'Dashboard':
        return <Dashboard />;
        case 'Staff Management':
            return <StaffManagement />;
      case 'Gym Rooms':
        return <GymRooms />; // Thêm dòng này
      default:
        return <div style={{ padding: '20px' }}>Coming Soon...</div>;
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar onSelectPage={setSelectedPage} selectedPage={selectedPage} />
      <div style={{ flex: 1, backgroundColor: '#eceff1' }}>
        {renderPage()}
      </div>
    </div>
  );
};

export default App;
