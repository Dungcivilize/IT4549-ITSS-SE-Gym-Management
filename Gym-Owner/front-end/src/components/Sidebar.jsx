import React from 'react';

const Sidebar = ({ onSelectPage, selectedPage }) => {
  const menuItems = [
    'Dashboard',
    'Staff Management',
    'Gym Rooms',
    'Equipment',
    'Revenue',
    'Staff Feedback',
    'Logout'
  ];

  return (
    <div style={{ width: '220px', backgroundColor: '#b0bec5', height: '100vh', padding: '20px 10px' }}>
      <h2 style={{ textAlign: 'center', color: '#fff' }}>GYMS</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {menuItems.map(item => (
          <li
            key={item}
            onClick={() => onSelectPage(item)}
            style={{
              margin: '10px 0',
              padding: '10px',
              cursor: 'pointer',
              backgroundColor: selectedPage === item ? '#78909c' : 'transparent',
              color: selectedPage === item ? 'white' : 'black',
              borderRadius: '5px',
              fontWeight: selectedPage === item ? 'bold' : 'normal'
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
