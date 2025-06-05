import React from 'react';

const Loading = ({ message = 'Đang tải...' }) => {
  const spinnerStyle = {
    border: '4px solid #35373b',
    borderTop: '4px solid #f9ac54',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 1rem'
  };

  // Inject keyframes for spinner animation
  React.useEffect(() => {
    const styleSheet = document.styleSheets[0];
    const keyframes = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    
    try {
      styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
    } catch (e) {
      // Keyframes already exist
    }
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px',
      color: '#d1d5db',
      fontFamily: 'Poppins, sans-serif'
    }}>
      <div style={spinnerStyle}></div>
      <p style={{
        fontSize: '1rem',
        fontWeight: '500'
      }}>
        {message}
      </p>
    </div>
  );
};

export default Loading; 