import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../../assets/css/Auth.module.css';
import logo from '../../assets/img/logo.png';
import axios from 'axios';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    fullname: '',
    phone: '',
    address: '',
    dateOfBirth: '',
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleDateChange = (e) => {
    let value = e.target.value;
    if (e.target.type === 'text') {
      // Chỉ cho phép nhập số
      value = value.replace(/\D/g, '');

      // Format theo YYYY-MM-DD
      if (value.length >= 4) {
        value = value.slice(0, 4) + '-' + value.slice(4);
      }
      if (value.length >= 7) {
        value = value.slice(0, 7) + '-' + value.slice(7);
      }
      if (value.length > 10) {
        value = value.slice(0, 10);
      }
    }
    setFormData({
      ...formData,
      dateOfBirth: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.dateOfBirth)) {
        setMessage({
          text: 'Ngày sinh không đúng định dạng (YYYY-MM-DD)',
          type: 'error',
        });
        return;
      }

      // Validate date value
      const [year, month, day] = formData.dateOfBirth.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
      ) {
        setMessage({
          text: 'Ngày sinh không hợp lệ',
          type: 'error',
        });
        return;
      }

      const response = await axios.post(
        'http://localhost:8080/api/register',
        formData
      );

      setMessage({
        text: response.data,
        type: 'success',
      });

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setMessage({
        text: err.response?.data || 'Đã có lỗi xảy ra khi đăng ký',
        type: 'error',
      });
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

      <div className={styles.wrapper1}>
        <div className={styles['form-header']}>
          <div className={styles.titles}>
            <div className={styles['title-login']}>Register</div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className={styles['login-form']}
          autoComplete="off"
        >
          {message.text && (
            <div
              className={
                message.type === 'success' ? styles.success : styles.error
              }
            >
              {message.text}
            </div>
          )}

          <div className={styles['input-box']}>
            <input
              type="email"
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
              type="text"
              className={styles['input-field']}
              id="fullname"
              required
              placeholder="Fullname"
              value={formData.fullname}
              onChange={handleChange}
            />
            <label htmlFor="fullname" className={styles.label}>
              Fullname
            </label>
          </div>

          <div className={styles['input-box']}>
            <input
              type="tel"
              className={styles['input-field']}
              id="phone"
              required
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <label htmlFor="phone" className={styles.label}>
              Phone
            </label>
          </div>

          <div className={styles['input-box']}>
            <input
              type="text"
              className={styles['input-field']}
              id="address"
              required
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
            />
            <label htmlFor="address" className={styles.label}>
              Address
            </label>
          </div>

          <div className={styles['input-box']}>
            <input
              type="text"
              className={styles['input-field']}
              id="dateOfBirth"
              required
              placeholder="YYYY-MM-DD"
              value={formData.dateOfBirth}
              onChange={(e) => {
                // Chỉ cho phép nhập số
                let value = e.target.value.replace(/\D/g, '');

                // Format theo YYYY-MM-DD
                if (value.length >= 4) {
                  value = value.slice(0, 4) + '-' + value.slice(4);
                }
                if (value.length >= 7) {
                  value = value.slice(0, 7) + '-' + value.slice(7);
                }
                if (value.length > 10) {
                  value = value.slice(0, 10);
                }

                setFormData({
                  ...formData,
                  dateOfBirth: value,
                });
              }}
            />
            <label htmlFor="dateOfBirth" className={styles.label}>
              Date of birth
            </label>
          </div>

          <div className={styles['form-cols']}>
            <div className={styles['col-1']}></div>
            <div className={styles['col-2']}>
              <Link to="#">Forgot password?</Link>
            </div>
          </div>

          <div className={styles['input-box']}>
            <button
              type="submit"
              className={styles['btn-submit']}
              id="SignUpBtn"
            >
              Sign Up <i className="bx bx-user-plus"></i>
            </button>
          </div>

          <div className={styles['switch-form']}>
            <span>
              Already have an account? <Link to="/login">Login</Link>
            </span>
          </div>
        </form>
      </div>
    </>
  );
}

export default Register;
