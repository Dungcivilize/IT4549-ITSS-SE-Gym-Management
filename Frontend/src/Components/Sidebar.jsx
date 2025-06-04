import React, { useState } from 'react';

const Sidebar = ({ selectedPage, onSelectPage }) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const menuItems = [
    'Dashboard',
    'Staff Management',
    'Gym Rooms',
    'Equipment',
    'Package Management',
  ];

  const user = JSON.parse(localStorage.getItem('user'));
  const name = user?.fullname || 'bạn';


  return (
    <div
      style={{
        width: '220px',
        height: '100vh',
        backgroundColor: '#37474f',
        padding: '20px 10px',
        borderRadius: '0 12px 12px 0',
        boxShadow: '2px 0 5px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        color: '#cfd8dc',
        justifyContent: 'space-between',
        position: 'fixed',
        left: 0,
        top: 0,
      }}
    >
      <div>
        <h2 style={{ textAlign: 'center', color: '#fff', marginBottom: '30px' }}>
          Chào {JSON.parse(localStorage.getItem('user'))?.fullname || 'bạn'}
        </h2>

        {menuItems.map((item) => {
          const isSelected = selectedPage === item;
          const isHovered = hoveredItem === item;

          // Màu nền ưu tiên selected > hover > transparent
          const backgroundColor = isSelected
            ? '#607d8b' // màu xanh khi chọn
            : isHovered
            ? '#455a64' // màu hover đậm hơn
            : 'transparent';

          return (
            <div
              key={item}
              onClick={() => onSelectPage(item)}
              onMouseEnter={() => setHoveredItem(item)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                padding: '12px 15px',
                marginBottom: '12px',
                cursor: 'pointer',
                borderRadius: '8px',
                backgroundColor: backgroundColor,
                color: isSelected ? '#fff' : '#cfd8dc',
                fontWeight: isSelected ? 'bold' : 'normal',
                userSelect: 'none',
                transition: 'background-color 0.3s ease',
              }}
            >
              {item}
            </div>
          );
        })}
      </div>

      {/* Logout riêng bên dưới */}
      <div
        onClick={() => onSelectPage('Logout')}
        onMouseEnter={() => setHoveredItem('Logout')}
        onMouseLeave={() => setHoveredItem(null)}
        style={{
          padding: '12px 15px',
          cursor: 'pointer',
          borderRadius: '8px',
          backgroundColor:
            selectedPage === 'Logout'
              ? '#d32f2f'
              : hoveredItem === 'Logout'
              ? '#e57373'
              : '#f44336',
          color: '#fff',
          fontWeight: 'bold',
          userSelect: 'none',
          textAlign: 'center',
          transition: 'background-color 0.3s ease',
        }}
      >
        Logout
      </div>
    </div>
  );
};

export default Sidebar;
