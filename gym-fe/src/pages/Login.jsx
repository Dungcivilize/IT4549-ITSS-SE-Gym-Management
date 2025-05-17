import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: username, password }),
      });

      setLoading(false);

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || 'Đăng nhập thất bại');
        return;
      }

      const user = await res.json();
      localStorage.setItem('user', JSON.stringify(user));

      switch (user.role.toLowerCase()) {
        case 'receptionist':
          navigate('/receptionist/dashboard');
          break;
        default:
          setError('Bạn không có quyền truy cập');
      }
    } catch (err) {
      setLoading(false);
      setError('Sai username hoặc password');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h2 className="login-title">🏋️‍♂️ Gym Management</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              id="username"
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              placeholder="Nhập tên đăng nhập"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="Nhập mật khẩu"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn btn-primary btn-submit" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
      </div>

      <style>{`
        html, body {
        height: 100%;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      .login-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
        box-sizing: border-box;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        margin: 0;
      }
      .login-box {
        background: white;
        padding: 40px 30px;
        border-radius: 12px;
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
        width: 100%;
        max-width: 400px;
        text-align: center;
      }
        .login-title {
          margin-bottom: 30px;
          font-weight: 700;
          color: #333;
          font-size: 1.8rem;
          letter-spacing: 1.2px;
        }
        .form-group {
          text-align: left;
          margin-bottom: 20px;
        }
        label {
          font-weight: 600;
          color: #555;
          margin-bottom: 6px;
          display: inline-block;
        }
        input.form-control {
          width: 100%;
          padding: 12px 15px;
          font-size: 1rem;
          border: 1.5px solid #ddd;
          border-radius: 8px;
          transition: border-color 0.3s ease;
        }
        input.form-control:focus {
          border-color: #667eea;
          outline: none;
          box-shadow: 0 0 8px rgba(102, 126, 234, 0.5);
        }
        .error-message {
          margin-bottom: 20px;
          color: #d9534f;
          font-weight: 600;
          font-size: 0.9rem;
          text-align: center;
        }
        .btn-submit {
          width: 100%;
          padding: 12px;
          font-size: 1.1rem;
          font-weight: 700;
          border-radius: 8px;
          background: #667eea;
          border: none;
          color: white;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .btn-submit:hover:not(:disabled) {
          background: #5a67d8;
        }
        .btn-submit:disabled {
          background: #a3bffa;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

export default Login;
