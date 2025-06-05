import { Link, useLocation } from 'react-router-dom';

const ReceptionistNav = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname.includes(path);

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
      fontFamily: 'Poppins, sans-serif'
    },
    link: {
      color: '#f3f4f6',
      textDecoration: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '6px',
      fontWeight: '500',
      transition: 'background-color 0.3s ease, color 0.3s ease',
      cursor: 'pointer',
      userSelect: 'none'
    },
    activeLink: {
      backgroundColor: '#f97316',
      color: 'white',
      fontWeight: '700',
      boxShadow: '0 0 8px #f97316'
    }
  };

  return (
    <nav style={navStyles.container}>
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          style={{
            ...navStyles.link,
            ...(isActive(item.to) ? navStyles.activeLink : {})
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
    </nav>
  );
};

export default ReceptionistNav;
