import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/img/logo.png';
import axios from 'axios';
import { setUser } from '../../utils/auth';
import Loading from '../../Components/Loading';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState({
    email: false,
    password: false,
  });

  useEffect(() => {
    // Inject CSS for hover effects
    const style = document.createElement('style');
    style.textContent = `
      .nav-link-hover::after {
        content: '';
        position: absolute;
        height: 2px;
        width: 0;
        left: 0;
        bottom: 0;
        background-color: #f9ac54;
        transition: 0.3s;
      }
      .nav-link-hover:hover::after {
        width: 50%;
      }
    `;
    document.head.appendChild(style);

    return () => document.head.removeChild(style);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        'http://localhost:8080/api/auth/login',
        formData
      );

      setUser(response.data);

      const role = response.data.role;
      if (role === 'receptionist') {
        navigate('/receptionist/revenue');
      } else if (role === 'trainer') {
        navigate('/trainer/home');
      } else if (role === 'member') {
        navigate('/member/home');
      } else if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        // Mặc định hoặc thông báo lỗi
        navigate('/');
      }
    } catch (err) {
      setError('Email hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  const pageStyles = {
    nav: {
      maxWidth: '1200px',
      margin: 'auto',
      padding: '2rem 1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '2rem',
      backgroundColor: 'transparent',
      boxShadow: 'none',
      fontFamily: 'Poppins, sans-serif',
    },
    navLogo: {
      maxWidth: '150px',
    },
    logoImg: {
      width: '100%',
      display: 'flex',
    },
    navLinks: {
      listStyle: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '3rem',
      margin: 0,
      padding: 0,
    },
    link: {
      position: 'relative',
      paddingBottom: '0.75rem',
      color: '#ffffff',
      textDecoration: 'none',
      fontWeight: '500',
    },
    btn: {
      padding: '1rem 2rem',
      outline: 'none',
      border: 'none',
      fontSize: '1rem',
      color: '#ffffff',
      backgroundColor: '#f9ac54',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: '0.3s',
      margin: '2px',
      textDecoration: 'none',
      display: 'inline-block',
    },
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      padding: '2rem',
    },
    formHeader: {
      marginBottom: '2rem',
      textAlign: 'center',
    },
    title: {
      fontSize: '2rem',
      fontWeight: '600',
      color: '#f9ac54',
      marginBottom: '1rem',
    },
    form: {
      backgroundColor: 'rgba(31, 33, 37, 0.9)',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      minWidth: '400px',
      backdropFilter: 'blur(10px)',
    },
    inputBox: {
      marginBottom: '1.5rem',
      position: 'relative',
    },
    inputField: {
      width: '100%',
      padding: '1rem 1rem 1rem 1.5rem',
      border: '2px solid #35373b',
      borderRadius: '8px',
      backgroundColor: '#111317',
      color: '#ffffff',
      fontSize: '1rem',
      outline: 'none',
      transition: 'border-color 0.3s ease',
      fontFamily: 'Poppins, sans-serif',
    },
    label: {
      position: 'absolute',
      top: '50%',
      left: '1.5rem',
      transform: 'translateY(-50%)',
      backgroundColor: '#111317',
      color: '#6b7280',
      padding: '0 0.5rem',
      fontSize: '1rem',
      fontWeight: '400',
      transition: 'all 0.3s ease',
      pointerEvents: 'none',
      cursor: 'text',
    },
    labelFocused: {
      top: '0',
      left: '1rem',
      fontSize: '0.85rem',
      color: '#f9ac54',
      fontWeight: '500',
    },
    error: {
      backgroundColor: '#dc2626',
      color: '#ffffff',
      padding: '0.75rem',
      borderRadius: '6px',
      marginBottom: '1rem',
      textAlign: 'center',
      fontSize: '0.9rem',
    },
    submitBtn: {
      width: '100%',
      padding: '1rem',
      backgroundColor: '#f9ac54',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      fontFamily: 'Poppins, sans-serif',
    },
    switchForm: {
      textAlign: 'center',
      marginTop: '1.5rem',
      color: '#d1d5db',
    },
    switchLink: {
      color: '#f9ac54',
      textDecoration: 'none',
      fontWeight: '500',
    },
    forgotLink: {
      color: '#f9ac54',
      textDecoration: 'none',
      fontSize: '0.9rem',
      textAlign: 'right',
      display: 'block',
      marginBottom: '1rem',
    },
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#111317',
          background:
            'radial-gradient(circle, rgba(249, 172, 84, 0.3) 0%, rgba(15, 15, 15, 0.95) 70%, #111317 100%)',
        }}
      >
        <Loading message="Đang đăng nhập..." />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#111317',
        background:
          'radial-gradient(circle, rgba(249, 172, 84, 0.3) 0%, rgba(15, 15, 15, 0.95) 70%, #111317 100%)',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      <nav style={pageStyles.nav}>
        <div style={pageStyles.navLogo}>
          <Link to="/">
            <img src={logo} alt="logo" style={pageStyles.logoImg} />
          </Link>
        </div>
        <ul style={pageStyles.navLinks}>
          <li>
            <a
              href="/#trang-chu"
              style={pageStyles.link}
              className="nav-link-hover"
            >
              Trang chủ
            </a>
          </li>
          <li>
            <a
              href="/#chuong-trinh"
              style={pageStyles.link}
              className="nav-link-hover"
            >
              Chương trình
            </a>
          </li>
          <li>
            <a
              href="/#dich-vu"
              style={pageStyles.link}
              className="nav-link-hover"
            >
              Dịch vụ
            </a>
          </li>
          <li>
            <a
              href="/#gioi-thieu"
              style={pageStyles.link}
              className="nav-link-hover"
            >
              Giới thiệu
            </a>
          </li>
          <li>
            <a
              href="/#cong-dong"
              style={pageStyles.link}
              className="nav-link-hover"
            >
              Cộng đồng
            </a>
          </li>
        </ul>
        <div>
          <Link
            to="/login"
            style={pageStyles.btn}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#d79447')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#f9ac54')}
          >
            Đăng nhập
          </Link>
          <Link
            to="/register"
            style={pageStyles.btn}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#d79447')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#f9ac54')}
          >
            Đăng ký
          </Link>
        </div>
      </nav>

      <div style={pageStyles.wrapper}>
        <div style={pageStyles.formHeader}>
          <div style={pageStyles.title}>Đăng nhập</div>
        </div>

        <form
          onSubmit={handleSubmit}
          style={pageStyles.form}
          autoComplete="off"
        >
          {error && <div style={pageStyles.error}>{error}</div>}

          <div style={pageStyles.inputBox}>
            <input
              type="text"
              style={pageStyles.inputField}
              id="email"
              required
              placeholder=" "
              value={formData.email}
              onChange={handleChange}
              onFocus={(e) => {
                e.target.style.borderColor = '#f9ac54';
                setFocused({ ...focused, email: true });
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#35373b';
                setFocused({ ...focused, email: false });
              }}
            />
            <label
              htmlFor="email"
              style={
                focused.email || formData.email
                  ? { ...pageStyles.label, ...pageStyles.labelFocused }
                  : pageStyles.label
              }
            >
              Email
            </label>
          </div>

          <div style={pageStyles.inputBox}>
            <input
              type="password"
              style={pageStyles.inputField}
              id="password"
              required
              placeholder=" "
              value={formData.password}
              onChange={handleChange}
              onFocus={(e) => {
                e.target.style.borderColor = '#f9ac54';
                setFocused({ ...focused, password: true });
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#35373b';
                setFocused({ ...focused, password: false });
              }}
            />
            <label
              htmlFor="password"
              style={
                focused.password || formData.password
                  ? { ...pageStyles.label, ...pageStyles.labelFocused }
                  : pageStyles.label
              }
            >
              Mật khẩu
            </label>
          </div>

          {/* <Link to="#" style={pageStyles.forgotLink}>
            Quên mật khẩu?
          </Link> */}

          <button
            type="submit"
            style={pageStyles.submitBtn}
            disabled={loading}
            onMouseOver={(e) =>
              !loading && (e.target.style.backgroundColor = '#d79447')
            }
            onMouseOut={(e) =>
              !loading && (e.target.style.backgroundColor = '#f9ac54')
            }
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>

          <div style={pageStyles.switchForm}>
            <span>
              Chưa có tài khoản?{' '}
              <Link to="/register" style={pageStyles.switchLink}>
                Đăng ký
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
