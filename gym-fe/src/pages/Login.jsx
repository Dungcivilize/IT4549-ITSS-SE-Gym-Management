import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: username, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || 'Login failed');
        return;
      }

      const user = await res.json();

      localStorage.setItem('user', JSON.stringify(user));

      // Điều hướng theo role (nên chuẩn hóa role thành chữ thường)
      switch (user.role.toLowerCase()) {
        case 'receptionist':
          navigate('/receptionist/dashboard');
          break;
        default:
          setError('Bạn không có quyền truy cập');
      }
    } catch (err) {
      setError('Sai username hoặc password');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary">Đăng nhập</button>
      </form>
    </div>
  );
}

export default Login;
