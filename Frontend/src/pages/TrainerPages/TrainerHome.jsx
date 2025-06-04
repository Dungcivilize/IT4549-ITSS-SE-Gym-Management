import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './TrainerHome.css';

function TrainerHome() {
  return (
    <div className="trainer-home-container">
      <h2 className="trainer-home-title">Trainer Dashboard</h2>
      <nav className="trainer-home-nav">
        <Link to="members">📋 Danh sách Member</Link> |{' '}
        <Link to="profile/edit">✏️ Sửa thông tin</Link>
      </nav>
      <hr className="trainer-home-hr" />
      <Outlet />
    </div>
  );
}

export default TrainerHome;
