import React, { useState } from 'react';

export default function CheckInCheckOut() {
  const [memberId, setMemberId] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' }); // success/error
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = async (actionType) => {
    if (!memberId) {
      setMessage({ text: 'Vui lòng nhập Member ID', type: 'error' });
      return;
    }

    setIsProcessing(true);
    setMessage({ text: '', type: '' });

    try {
      const endpoint = actionType === 'checkIn' 
        ? 'check-in' 
        : 'check-out';
      
      const res = await fetch(`http://localhost:8080/api/attendance/${endpoint}?memberId=${memberId}`, {
        method: 'POST',
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || `${actionType === 'checkIn' ? 'Check-in' : 'Check-out'} thất bại`);
      }

      const data = await res.json();
      const actionTime = actionType === 'checkIn' 
        ? data.checkInTime 
        : data.checkOutTime;
      
      setMessage({ 
        text: `${actionType === 'checkIn' ? 'Check-in' : 'Check-out'} thành công lúc: ${new Date(actionTime).toLocaleString()}`,
        type: 'success'
      });
    } catch (error) {
      setMessage({ 
        text: `Lỗi: ${error.message}`,
        type: 'error'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Check-in / Check-out</h2>
      
      <div style={inputContainerStyle}>
        <input
          type="number"
          placeholder="Nhập Member ID"
          value={memberId}
          onChange={e => setMemberId(e.target.value)}
          style={inputStyle}
          disabled={isProcessing}
        />
        
        <div style={buttonGroupStyle}>
          <button 
            onClick={() => handleAction('checkIn')} 
            style={{
              ...buttonStyle,
              backgroundColor: '#48BB78', // Màu xanh lá
              opacity: isProcessing ? 0.7 : 1,
            }}
            disabled={isProcessing}
          >
            {isProcessing ? 'Đang xử lý...' : 'Check-in'}
          </button>
          
          <button 
            onClick={() => handleAction('checkOut')} 
            style={{
              ...buttonStyle,
              backgroundColor: '#F56565', // Màu đỏ
              marginLeft: '12px',
              opacity: isProcessing ? 0.7 : 1,
            }}
            disabled={isProcessing}
          >
            {isProcessing ? 'Đang xử lý...' : 'Check-out'}
          </button>
        </div>
      </div>

      {message.text && (
        <div style={{
          ...messageStyle,
          backgroundColor: message.type === 'success' ? '#F0FFF4' : '#FFF5F5',
          color: message.type === 'success' ? '#2F855A' : '#C53030',
          borderLeft: `4px solid ${message.type === 'success' ? '#48BB78' : '#F56565'}`
        }}>
          {message.text}
        </div>
      )}
    </div>
  );
}

// Styles
const containerStyle = {
  maxWidth: '500px',
  margin: '2rem auto',
  padding: '2rem',
  backgroundColor: 'white',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
};

const headerStyle = {
  textAlign: 'center',
  color: '#2D3748',
  marginBottom: '1.5rem',
  fontSize: '1.5rem'
};

const inputContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};

const inputStyle = {
  padding: '0.75rem 1rem',
  borderRadius: '8px',
  border: '1px solid #E2E8F0',
  fontSize: '1rem',
  transition: 'border-color 0.3s, box-shadow 0.3s',
  ':focus': {
    outline: 'none',
    borderColor: '#667EEA',
    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.2)'
  }
};

const buttonGroupStyle = {
  display: 'flex',
  justifyContent: 'center',
  marginTop: '0.5rem'
};

const buttonStyle = {
  padding: '0.75rem 1.5rem',
  borderRadius: '8px',
  border: 'none',
  color: 'white',
  fontWeight: '600',
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  ':hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.15)'
  },
  ':active': {
    transform: 'translateY(0)'
  },
  ':disabled': {
    cursor: 'not-allowed',
    opacity: '0.7'
  }
};

const messageStyle = {
  marginTop: '1.5rem',
  padding: '1rem',
  borderRadius: '6px',
  fontSize: '0.95rem',
  lineHeight: '1.5',
  transition: 'all 0.3s ease'
};