import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/img/logo.png';
import axios from 'axios';
import { setUser } from '../../utils/auth';
import Loading from '../../Components/Loading';

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
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState({
    email: false,
    fullname: false,
    phone: false,
    address: false,
    dateOfBirth: false
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
    setLoading(true);
    setMessage({ text: '', type: '' });
    
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
      fontFamily: 'Poppins, sans-serif'
    },
    navLogo: {
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
      gap: '3rem',
      margin: 0,
      padding: 0
    },
    link: {
      position: 'relative',
      paddingBottom: '0.75rem',
      color: '#ffffff',
      textDecoration: 'none',
      fontWeight: '500'
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
      display: 'inline-block'
    },
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '70vh',
      padding: '2rem'
    },
    formHeader: {
      marginBottom: '2rem',
      textAlign: 'center'
    },
    title: {
      fontSize: '2rem',
      fontWeight: '600',
      color: '#f9ac54',
      marginBottom: '1rem'
    },
    form: {
      backgroundColor: 'rgba(31, 33, 37, 0.9)',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      minWidth: '450px',
      backdropFilter: 'blur(10px)',
      maxHeight: '80vh',
      overflowY: 'auto'
    },
    inputBox: {
      marginBottom: '1.2rem',
      position: 'relative'
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
      fontFamily: 'Poppins, sans-serif'
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
      cursor: 'text'
    },
    labelFocused: {
      top: '0',
      left: '1rem',
      fontSize: '0.85rem',
      color: '#f9ac54',
      fontWeight: '500'
    },
    message: {
      padding: '0.75rem',
      borderRadius: '6px',
      marginBottom: '1rem',
      textAlign: 'center',
      fontSize: '0.9rem'
    },
    successMessage: {
      backgroundColor: '#10b981',
      color: '#ffffff'
    },
    errorMessage: {
      backgroundColor: '#dc2626',
      color: '#ffffff'
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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem'
    },
    switchForm: {
      textAlign: 'center',
      marginTop: '1.5rem',
      color: '#d1d5db'
    },
    switchLink: {
      color: '#f9ac54',
      textDecoration: 'none',
      fontWeight: '500'
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#111317',
        background: 'radial-gradient(circle, rgba(249, 172, 84, 0.3) 0%, rgba(15, 15, 15, 0.95) 70%, #111317 100%)'
      }}>
        <Loading message="Đang đăng ký..." />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#111317',
      background: 'radial-gradient(circle, rgba(249, 172, 84, 0.3) 0%, rgba(15, 15, 15, 0.95) 70%, #111317 100%)',
      fontFamily: 'Poppins, sans-serif'
    }}>
      <nav style={pageStyles.nav}>
        <div style={pageStyles.navLogo}>
          <Link to="/">
            <img src={logo} alt="logo" style={pageStyles.logoImg} />
          </Link>
        </div>
                 <ul style={pageStyles.navLinks}>
           <li>
             <a href="/#trang-chu" style={pageStyles.link} className="nav-link-hover">
               Trang chủ
             </a>
           </li>
           <li>
             <a href="/#chuong-trinh" style={pageStyles.link} className="nav-link-hover">
               Chương trình
             </a>
           </li>
           <li>
             <a href="/#dich-vu" style={pageStyles.link} className="nav-link-hover">
               Dịch vụ
             </a>
           </li>
           <li>
             <a href="/#gioi-thieu" style={pageStyles.link} className="nav-link-hover">
               Giới thiệu
             </a>
           </li>
           <li>
             <a href="/#cong-dong" style={pageStyles.link} className="nav-link-hover">
               Cộng đồng
             </a>
           </li>
         </ul>
        <div>
          <Link 
            to="/login" 
            style={pageStyles.btn}
            onMouseOver={(e) => e.target.style.backgroundColor = '#d79447'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#f9ac54'}
          >
            Đăng nhập
          </Link>
          <Link 
            to="/register" 
            style={pageStyles.btn}
            onMouseOver={(e) => e.target.style.backgroundColor = '#d79447'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#f9ac54'}
          >
            Đăng ký
          </Link>
        </div>
      </nav>

      <div style={pageStyles.wrapper}>
        <div style={pageStyles.formHeader}>
          <div style={pageStyles.title}>Đăng ký</div>
        </div>

        <form onSubmit={handleSubmit} style={pageStyles.form} autoComplete="off">
          {message.text && (
            <div style={{
              ...pageStyles.message,
              ...(message.type === 'success' ? pageStyles.successMessage : pageStyles.errorMessage)
            }}>
              {message.text}
            </div>
          )}

          <div style={pageStyles.inputBox}>
            <input
              type="email"
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
            <label htmlFor="email" style={focused.email || formData.email ? { ...pageStyles.label, ...pageStyles.labelFocused } : pageStyles.label}>
              Email
            </label>
          </div>

          <div style={pageStyles.inputBox}>
            <input
              type="text"
              style={pageStyles.inputField}
              id="fullname"
              required
              placeholder=" "
              value={formData.fullname}
              onChange={handleChange}
              onFocus={(e) => {
                e.target.style.borderColor = '#f9ac54';
                setFocused({ ...focused, fullname: true });
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#35373b';
                setFocused({ ...focused, fullname: false });
              }}
            />
            <label htmlFor="fullname" style={focused.fullname || formData.fullname ? { ...pageStyles.label, ...pageStyles.labelFocused } : pageStyles.label}>
              Họ và tên
            </label>
          </div>

          <div style={pageStyles.inputBox}>
            <input
              type="tel"
              style={pageStyles.inputField}
              id="phone"
              required
              placeholder=" "
              value={formData.phone}
              onChange={handleChange}
              onFocus={(e) => {
                e.target.style.borderColor = '#f9ac54';
                setFocused({ ...focused, phone: true });
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#35373b';
                setFocused({ ...focused, phone: false });
              }}
            />
            <label htmlFor="phone" style={focused.phone || formData.phone ? { ...pageStyles.label, ...pageStyles.labelFocused } : pageStyles.label}>
              Số điện thoại
            </label>
          </div>

          <div style={pageStyles.inputBox}>
            <input
              type="text"
              style={pageStyles.inputField}
              id="address"
              required
              placeholder=" "
              value={formData.address}
              onChange={handleChange}
              onFocus={(e) => {
                e.target.style.borderColor = '#f9ac54';
                setFocused({ ...focused, address: true });
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#35373b';
                setFocused({ ...focused, address: false });
              }}
            />
            <label htmlFor="address" style={focused.address || formData.address ? { ...pageStyles.label, ...pageStyles.labelFocused } : pageStyles.label}>
              Địa chỉ
            </label>
          </div>

          <div style={pageStyles.inputBox}>
            <input
              type="text"
              style={pageStyles.inputField}
              id="dateOfBirth"
              required
              placeholder=" "
              value={formData.dateOfBirth}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, '');
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
              onFocus={(e) => {
                e.target.style.borderColor = '#f9ac54';
                setFocused({ ...focused, dateOfBirth: true });
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#35373b';
                setFocused({ ...focused, dateOfBirth: false });
              }}
            />
            <label htmlFor="dateOfBirth" style={focused.dateOfBirth || formData.dateOfBirth ? { ...pageStyles.label, ...pageStyles.labelFocused } : pageStyles.label}>
              Ngày sinh
            </label>
          </div>

          <button 
            type="submit" 
            style={pageStyles.submitBtn}
            disabled={loading}
            onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#d79447')}
            onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#f9ac54')}
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>

          <div style={pageStyles.switchForm}>
            <span>
              Đã có tài khoản?{' '}
              <Link to="/login" style={pageStyles.switchLink}>
                Đăng nhập
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
