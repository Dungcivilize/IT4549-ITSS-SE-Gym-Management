import React, { useEffect, useState } from 'react';
import { getUser, getUserId } from '../../utils/auth';
import './TrainerProfileEdit.css';

export default function TrainerProfileEdit() {
  const [profile, setProfile] = useState({
    userName: '',
    email: '',
    phone: '',
    fullname: '',
    address: '',
    dateOfBirth: '',
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const user = getUser();
  const trainerId = getUserId();

  useEffect(() => {
    if (!user) {
      setMessage("Không tìm thấy thông tin người dùng.");
      setLoading(false);
      return;
    }

    setProfile({
      userName: user.user_name || '',
      email: user.email || '',
      phone: user.phone || '',
      fullname: user.fullname || '',
      address: user.address || '',
      dateOfBirth: user.date_of_birth || '',
    });
    setLoading(false);
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setMessage('');
    fetch(`/api/trainer/profile/${trainerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    })
      .then(res => {
        if (!res.ok) throw new Error('Lỗi khi cập nhật thông tin');
        return res.json();
      })
      .then(() => setMessage('✅ Cập nhật thành công!'))
      .catch(err => setMessage(`❌ ${err.message}`));
  };

  if (loading) return <div className="trainer-profile-edit-loading">Đang tải...</div>;

  return (
    <div className="trainer-profile-edit-container">
      <h2 className="trainer-profile-edit-title">Chỉnh sửa thông tin cá nhân Trainer</h2>
      {message && (
        <div className={`trainer-profile-edit-message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="trainer-profile-edit-form">
        {[
          { label: 'User Name', name: 'userName' },
          { label: 'Full Name', name: 'fullname' },
          { label: 'Email', name: 'email', type: 'email' },
          { label: 'Phone', name: 'phone' },
          { label: 'Address', name: 'address' },
          { label: 'Date of Birth', name: 'dateOfBirth', type: 'date' }
        ].map(({ label, name, type = 'text' }) => (
          <div className="trainer-profile-edit-group" key={name}>
            <label className="trainer-profile-edit-label">{label}</label>
            <input
              type={type}
              name={name}
              value={profile[name]}
              onChange={handleChange}
              required={name !== 'address'}
              className="trainer-profile-edit-input"
            />
          </div>
        ))}
        <button type="submit" className="trainer-profile-edit-button">💾 Lưu thay đổi</button>
      </form>
    </div>
  );
}
