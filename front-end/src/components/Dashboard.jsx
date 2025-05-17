import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../assets/css/Auth.module.css';
import logo from '../assets/img/logo.png';

function Dashboard() {
  // Lấy thông tin user từ localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.nav__logo}>
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <ul className={styles.nav__links}>
          <li className={styles.link}><Link to="/">Home</Link></li>
          <li className={styles.link}><Link to="#">Program</Link></li>
          <li className={styles.link}><Link to="#">Service</Link></li>
          <li className={styles.link}><Link to="#">About</Link></li>
          <li className={styles.link}><Link to="#">Community</Link></li>
        </ul>
        <button 
          onClick={() => {
            localStorage.removeItem('user');
            window.location.href = '/login';
          }} 
          className={styles.btn}
        >
          Logout
        </button>
      </nav>
      
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '70vh',
        fontSize: '24px',
        color: 'var(--white-color)'
      }}>
        <h1>Xin chào, {user?.userName || 'Guest'}!</h1>
      </div>
    </>
  );
}

export default Dashboard;