import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../assets/css/Auth.module.css';
import logo from '../assets/img/logo.png';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8080/api/auth/login',
        formData
      );

      // Tạo object user từ response
      const user = {
        userId: response.data.user_id,
        userName: response.data.user_name,
        role: response.data.role,
        fullname: response.data.fullname,
        memberId: response.data.member_id,
      };

      // Lưu vào localStorage
      localStorage.setItem('user', JSON.stringify(user));

      // Điều hướng dựa theo role
      if (user.role === 'member') {
        navigate('/member-home');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Email hoặc mật khẩu không đúng');
    }
  };

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.nav__logo}>
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <ul className={styles.nav__links}>
          <li className={styles.link}>
            <Link to="/">Home</Link>
          </li>
          <li className={styles.link}>
            <Link to="#">Program</Link>
          </li>
          <li className={styles.link}>
            <Link to="#">Service</Link>
          </li>
          <li className={styles.link}>
            <Link to="#">About</Link>
          </li>
          <li className={styles.link}>
            <Link to="#">Community</Link>
          </li>
        </ul>
        <Link to="/login" className={styles.btn}>
          Login
        </Link>
        <Link to="/register" className={styles.btn}>
          Register
        </Link>
      </nav>

      <div className={styles.wrapper}>
        <div className={styles['form-header']}>
          <div className={styles.titles}>
            <div className={styles['title-login']}>Login</div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className={styles['login-form']}
          autoComplete="off"
        >
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles['input-box']}>
            <input
              type="text"
              className={styles['input-field']}
              id="email"
              required
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
          </div>

          <div className={styles['input-box']}>
            <input
              type="password"
              className={styles['input-field']}
              id="password"
              required
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
          </div>

          <div className={styles['form-cols']}>
            <div className={styles['col-1']}></div>
            <div className={styles['col-2']}>
              <Link to="#">Forgot password?</Link>
            </div>
          </div>

          <div className={styles['input-box']}>
            <button type="submit" className={styles['btn-submit']}>
              Sign In <i className="bx bx-user"></i>
            </button>
          </div>

          <div className={styles['switch-form']}>
            <span>
              Don't have an account? <Link to="/register">Register</Link>
            </span>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
