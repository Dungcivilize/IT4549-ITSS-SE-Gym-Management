import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#111317',
          color: '#fff',
          fontFamily: 'Poppins, sans-serif'
        }}>
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            backgroundColor: '#1f2125',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            maxWidth: '500px'
          }}>
            <h2 style={{
              color: '#f9ac54',
              marginBottom: '1rem',
              fontSize: '1.5rem'
            }}>
              Đã có lỗi xảy ra
            </h2>
            <p style={{
              marginBottom: '1.5rem',
              color: '#d1d5db'
            }}>
              Có lỗi không mong muốn đã xảy ra. Vui lòng tải lại trang.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f9ac54',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem',
                transition: 'background-color 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#d79447'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#f9ac54'}
            >
              Tải lại trang
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 