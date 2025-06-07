import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import './TrainerHome.css';

function TrainerHome() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xóa thông tin người dùng khỏi localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Chuyển hướng về trang đăng nhập
    navigate('/login');
  };

  return (
    <div className="trainer-home-container">
      <h2 className="trainer-home-title">Trainer Dashboard</h2>
      <nav className="trainer-home-nav">
        <Link to="members">📋 Danh sách Member</Link> |{' '}
        <Link to="profile/edit">✏️ Sửa thông tin</Link> |{' '}
        <button onClick={handleLogout} className="logout-button">🚪 Đăng xuất</button>
      </nav>
      <hr className="trainer-home-hr" />
      <Outlet />
    </div>
  );
}

export default TrainerHome;
