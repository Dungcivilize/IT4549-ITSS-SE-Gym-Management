import { Link, useLocation, useNavigate } from 'react-router-dom';
import { removeUser, getUserName } from '../utils/auth';

const ReceptionistNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname.includes(path);

  const handleLogout = () => {
    const confirmed = window.confirm('Bạn có chắc chắn muốn đăng xuất?');
    if (confirmed) {
      removeUser();
      navigate('/');
    }
  };

  const navItems = [
    { to: 'revenue', text: 'Doanh thu' },
    { to: 'equipment', text: 'Thiết bị' },
    { to: 'membership-approval', text: 'Duyệt gói tập' },
    { to: 'profile', text: 'Thông tin cá nhân' },
  ];

  const navStyles = {
    container: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
      backgroundColor: 'rgba(15, 15, 15, 0.7)',
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(249, 115, 22, 0.3)',
      fontFamily: 'Poppins, sans-serif',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    leftSection: {
      display: 'flex',
      gap: '1rem',
    },
    rightSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    welcomeText: {
      color: '#f3f4f6',
      fontSize: '0.9rem',
      fontWeight: '500',
    },
    userName: {
      color: '#f97316',
      fontWeight: '600',
    },
    link: {
      color: '#f3f4f6',
      textDecoration: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '6px',
      fontWeight: '500',
      transition: 'background-color 0.3s ease, color 0.3s ease',
      cursor: 'pointer',
      userSelect: 'none',
    },
    activeLink: {
      backgroundColor: '#f97316',
      color: 'white',
      fontWeight: '700',
      boxShadow: '0 0 8px #f97316',
    },
    logoutBtn: {
      color: '#f3f4f6',
      textDecoration: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '6px',
      fontWeight: '500',
      transition: 'background-color 0.3s ease, color 0.3s ease',
      cursor: 'pointer',
      userSelect: 'none',
      backgroundColor: '#dc2626',
      border: 'none',
    },
  };

  const userName = getUserName();

  return (
    <nav style={navStyles.container}>
      <div style={navStyles.leftSection}>
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            style={{
              ...navStyles.link,
              ...(isActive(item.to) ? navStyles.activeLink : {}),
            }}
            onMouseOver={(e) => {
              if (!isActive(item.to)) {
                e.target.style.backgroundColor = 'rgba(249, 115, 22, 0.2)';
                e.target.style.color = '#f59e0b';
              }
            }}
            onMouseOut={(e) => {
              if (!isActive(item.to)) {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#f3f4f6';
              }
            }}
          >
            {item.text}
          </Link>
        ))}
      </div>

      <div style={navStyles.rightSection}>
        <span style={navStyles.welcomeText}>
          Xin chào, <span style={navStyles.userName}>{userName}</span>
        </span>
        <button
          style={navStyles.logoutBtn}
          onClick={handleLogout}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#b91c1c';
            e.target.style.color = '#ffffff';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#dc2626';
            e.target.style.color = '#f3f4f6';
          }}
        >
          🚪 Đăng xuất
        </button>
      </div>
    </nav>
  );
};

export default ReceptionistNav;
