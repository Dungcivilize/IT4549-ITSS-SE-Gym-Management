import React, { useState } from 'react';
import './Sidebar.css';

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
    <div className="sidebar">
      <div className="sidebar-menu">
        <h2 className="sidebar-header">
          Chào {name}
        </h2>

        {menuItems.map((item) => {
          const isSelected = selectedPage === item;
          
          return (
            <div
              key={item}
              onClick={() => onSelectPage(item)}
              className={`sidebar-menu-item ${isSelected ? 'active' : ''}`}
            >
              {item}
            </div>
          );
        })}
      </div>

      <div
        onClick={() => onSelectPage('Logout')}
        className="sidebar-logout"
      >
        Logout
      </div>
    </div>
  );
};

export default Sidebar;