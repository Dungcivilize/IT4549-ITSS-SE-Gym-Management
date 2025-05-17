import React, { useState, useEffect } from 'react';

export default function MemberForm({ member, onSuccess }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    fullname: '',
    password: '',
    address: '',
    dateOfBirth: '',
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (member) {
      setFormData({
        ...member,
        password: '',
      });
    } else {
      setFormData({
        username: '',
        email: '',
        phone: '',
        fullname: '',
        password: '',
        address: '',
        dateOfBirth: '',
      });
    }
  }, [member]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.username.trim()) return 'Username không được để trống';
    if (!formData.fullname.trim()) return 'Full name không được để trống';
    if (!formData.email.trim()) return 'Email không được để trống';
    if (!/\S+@\S+\.\S+/.test(formData.email)) return 'Email không hợp lệ';
    if (!formData.phone.trim()) return 'Phone không được để trống';
    if (!member && !formData.password) return 'Password không được để trống';
    return '';
  };

  const handleSubmit = () => {
    const errorMsg = validate();
    if (errorMsg) {
      setError(errorMsg);
      return;
    }
    setShowConfirmation(true);
  };

  const confirmSubmit = () => {
    setIsSubmitting(true);
    setShowConfirmation(false);

    const method = member ? 'PUT' : 'POST';
    const url = member
      ? `http://localhost:8080/api/receptionist/members/${member.memberId}`
      : 'http://localhost:8080/api/receptionist/members';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then(res => {
        if (!res.ok) throw new Error('Lỗi khi lưu dữ liệu');
        return res.json();
      })
      .then(() => {
        setError('');
        onSuccess();
      })
      .catch(err => setError(err.message))
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div style={formContainerStyle}>
      <h2 style={formTitleStyle}>
        {member ? 'Chỉnh sửa thành viên' : 'Thêm thành viên mới'}
      </h2>

      {error && (
        <div style={errorMessageStyle}>
          {error}
        </div>
      )}

      <div style={inputGridStyle}>
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Username</label>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Full Name</label>
          <input
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Phone</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        
        {!member && (
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        )}
        
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Address</label>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        
        <div style={{ 
          ...inputGroupStyle,
          gridColumn: '1 / -1',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <label style={labelStyle}>Date of Birth</label>
          <input
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            style={{ ...inputStyle, width: '50%', minWidth: '200px' }}
          />
        </div>
      </div>

      <button 
        onClick={handleSubmit} 
        style={{
          ...buttonStyle,
          backgroundColor: isSubmitting ? '#4a5568' : '#667eea',
          transform: isSubmitting ? 'scale(0.98)' : 'scale(1)'
        }}
        disabled={isSubmitting}
        onMouseOver={e => !isSubmitting && (e.currentTarget.style.transform = 'scale(1.03)')}
        onMouseOut={e => !isSubmitting && (e.currentTarget.style.transform = 'scale(1)')}
      >
        {isSubmitting ? 'Đang xử lý...' : (member ? 'Cập nhật' : 'Thêm mới')}
      </button>

      {showConfirmation && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ marginBottom: '15px' }}>Xác nhận</h3>
            <p style={{ marginBottom: '25px' }}>
              Bạn có chắc chắn muốn {member ? 'cập nhật' : 'thêm mới'} thành viên này?
            </p>
            <div style={modalButtonGroupStyle}>
              <button 
                onClick={() => setShowConfirmation(false)}
                style={{ ...modalButtonStyle, backgroundColor: '#e53e3e' }}
              >
                Hủy bỏ
              </button>
              <button 
                onClick={confirmSubmit}
                style={{ ...modalButtonStyle, backgroundColor: '#38a169' }}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
const formContainerStyle = {
  width: '100%',
  maxWidth: '900px',
  margin: '20px auto',
  padding: '30px',
  backgroundColor: 'white',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
};

const formTitleStyle = {
  textAlign: 'center',
  marginBottom: '25px',
  color: '#2d3748',
  fontSize: '24px'
};

const errorMessageStyle = {
  color: '#e53e3e',
  marginBottom: '20px',
  textAlign: 'center',
  padding: '12px',
  backgroundColor: '#fff5f5',
  borderRadius: '6px',
  border: '1px solid #fed7d7'
};

const inputGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '20px',
  marginBottom: '25px'
};

const inputGroupStyle = {
  display: 'flex',
  flexDirection: 'column'
};

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: '600',
  color: '#4a5568',
  fontSize: '14px'
};

const inputStyle = {
  width: '100%',
  padding: '12px 15px',
  borderRadius: '6px',
  border: '1px solid #e2e8f0',
  fontSize: '14px',
  boxSizing: 'border-box',
  transition: 'border-color 0.3s, box-shadow 0.3s',
  ':focus': {
    outline: 'none',
    borderColor: '#667eea',
    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.2)'
  }
};

const buttonStyle = {
  width: '220px',
  padding: '14px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: '#667eea',
  color: 'white',
  fontWeight: '600',
  fontSize: '16px',
  cursor: 'pointer',
  display: 'block',
  margin: '25px auto 0',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  ':hover': {
    boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)'
  },
  ':active': {
    transform: 'scale(0.98)'
  }
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

const modalContentStyle = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '12px',
  maxWidth: '450px',
  width: '90%',
  textAlign: 'center',
  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
};

const modalButtonGroupStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '20px',
  marginTop: '25px'
};

const modalButtonStyle = {
  width: '120px',
  padding: '12px',
  borderRadius: '8px',
  border: 'none',
  color: 'white',
  fontWeight: '600',
  fontSize: '14px',
  cursor: 'pointer',
  transition: 'transform 0.2s',
  ':hover': {
    transform: 'translateY(-2px)'
  },
  ':active': {
    transform: 'translateY(0)'
  }
};