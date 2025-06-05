import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserName, getUserRole, removeUser } from '../utils/auth';
import logo from '../assets/img/logo.png';

const UniversalNavbar = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const userName = getUserName();
  const userRole = getUserRole();

  const handleLogout = () => {
    removeUser();
    navigate('/login');
  };

  const navStyles = {
    nav: {
      maxWidth: '1200px',
      margin: 'auto',
      padding: '1.5rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '3rem',
      borderRadius: '8px',
      fontFamily: 'Poppins, sans-serif'
    },
    logo: {
      maxWidth: '150px'
    },
    logoImg: {
      width: '100%',
      display: 'flex'
    },
    navLinks: {
      listStyle: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '2rem',
      margin: 0,
      padding: 0
    },
    navLink: {
      color: '#ffffff',
      textDecoration: 'none',
      fontWeight: '500',
      padding: '0.5rem 1rem',
      borderRadius: '6px',
      transition: 'background-color 0.3s ease'
    },
    btn: {
      padding: '0.5rem 1.2rem',
      outline: 'none',
      border: 'none',
      fontSize: '0.9rem',
      fontWeight: '600',
      color: '#ffffff',
      backgroundColor: '#f9ac54',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
      boxShadow: '0 2px 5px rgba(249, 172, 84, 0.6)',
      textDecoration: 'none',
      display: 'inline-block',
      textAlign: 'center'
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    userDropdown: {
      position: 'relative'
    },
    userButton: {
      color: 'white',
      cursor: 'pointer',
      padding: '0.5rem',
      borderRadius: '4px',
      transition: 'background-color 0.3s ease'
    },
    dropdown: {
      position: 'absolute',
      top: '100%',
      right: 0,
      backgroundColor: '#1f2125',
      borderRadius: '8px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      padding: '0.5rem 0',
      minWidth: '200px',
      zIndex: 1000
    },
    dropdownItem: {
      display: 'block',
      padding: '0.75rem 1rem',
      color: '#d1d5db',
      textDecoration: 'none',
      transition: 'background-color 0.3s ease'
    }
  };

  const getNavLinksForRole = () => {
    switch (userRole) {
      case 'member':
        return [
          { to: '/member/home', text: 'Trang chủ' },
          { to: '/packages', text: 'Đăng ký gói tập' },
          { to: '/schedule', text: 'Lịch tập' },
          { to: '/feedback', text: 'Phản hồi' }
        ];
      case 'receptionist':
        return [
          { to: '/receptionist/revenue', text: 'Doanh thu' },
          { to: '/receptionist/equipment', text: 'Thiết bị' },
          { to: '/receptionist/membership-approval', text: 'Duyệt gói tập' }
        ];
      case 'trainer':
        return [
          { to: '/trainer/home', text: 'Dashboard' },
          { to: '/trainer/home/members', text: 'Danh sách Member' }
        ];
      case 'admin':
        return [
          { to: '/admin/dashboard', text: 'Dashboard' }
        ];
      default:
        return [];
    }
  };

  const getDropdownLinksForRole = () => {
    switch (userRole) {
      case 'member':
        return [
          { to: '/member/profile', text: 'Thông tin hội viên' },
          { to: '/member/change-password', text: 'Thay đổi mật khẩu' }
        ];
      case 'receptionist':
        return [
          { to: '/receptionist/profile', text: 'Thông tin cá nhân' }
        ];
      case 'trainer':
        return [
          { to: '/trainer/home/profile/edit', text: 'Sửa thông tin' }
        ];
      case 'admin':
        return [];
      default:
        return [];
    }
  };

  const navLinks = getNavLinksForRole();
  const dropdownLinks = getDropdownLinksForRole();

  return (
    <nav style={navStyles.nav}>
      <div style={navStyles.logo}>
        <Link to={userRole === 'member' ? '/member/home' : `/${userRole}/dashboard`}>
          <img src={logo} alt="logo" style={navStyles.logoImg} />
        </Link>
      </div>

      <ul style={navStyles.navLinks}>
        {navLinks.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              style={navStyles.navLink}
              onMouseOver={(e) => e.target.style.backgroundColor = '#35373b'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              {link.text}
            </Link>
          </li>
        ))}
      </ul>

      <div style={navStyles.userInfo}>
        <div style={navStyles.userDropdown}>
          <div
            style={navStyles.userButton}
            onClick={() => setShowDropdown(!showDropdown)}
            onMouseOver={(e) => e.target.style.backgroundColor = '#35373b'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            👤 {userName}
          </div>
          {showDropdown && (
            <div style={navStyles.dropdown}>
              {dropdownLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={navStyles.dropdownItem}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#35373b'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                  onClick={() => setShowDropdown(false)}
                >
                  {link.text}
                </Link>
              ))}
            </div>
          )}
        </div>
        <button
          style={navStyles.btn}
          onClick={handleLogout}
          onMouseOver={(e) => e.target.style.backgroundColor = '#d79447'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#f9ac54'}
        >
          Đăng xuất
        </button>
      </div>
    </nav>
  );
};

export default UniversalNavbar; 