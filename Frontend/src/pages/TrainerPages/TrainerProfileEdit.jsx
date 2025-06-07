import React, { useState } from 'react';
import './TrainerProfileEdit.css';

export default function TrainerProfileEdit() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(() => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    return { ...user };
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user')) || {};

  const handleEdit = () => {
    setIsEditing(true);
    setFormData(user);
    setSuccess('');
    setError('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(user);
    setSuccess('');
    setError('');
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    try {
      const response = await fetch(
        `http://localhost:8080/api/profile/update/${user.user_id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_name: formData.user_name,
            fullname: formData.fullname,
            email: formData.email,
            phone: formData.phone,
            date_of_birth: formData.date_of_birth,
            address: formData.address,
          }),
        }
      );
      if (!response.ok) {
        throw new Error('Cập nhật thất bại!');
      }
      setIsEditing(false);
      setSuccess('Cập nhật thành công!');
      // Cập nhật lại localStorage
      localStorage.setItem('user', JSON.stringify({ ...user, ...formData }));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="trainer-profile-edit-container">
      <h2 className="trainer-profile-edit-title">Thông tin huấn luyện viên</h2>
      {success && (
        <div className="trainer-profile-edit-message success">{success}</div>
      )}
      {error && (
        <div className="trainer-profile-edit-message error">{error}</div>
      )}
      <div className="trainer-profile-edit-form">
        <div className="trainer-profile-edit-group">
          <span className="profile-item-icon">👤</span>
          <b>Tên đăng nhập:</b>
          {isEditing ? (
            <input
              name="user_name"
              value={formData.user_name || ''}
              onChange={handleChange}
              className="trainer-profile-edit-input"
            />
          ) : (
            <span>{user.user_name}</span>
          )}
        </div>

        <div className="trainer-profile-edit-group">
          <span className="profile-item-icon">📝</span>
          <b>Họ tên:</b>
          {isEditing ? (
            <input
              name="fullname"
              value={formData.fullname || ''}
              onChange={handleChange}
              className="trainer-profile-edit-input"
            />
          ) : (
            <span>{user.fullname}</span>
          )}
        </div>

        <div className="trainer-profile-edit-group">
          <span className="profile-item-icon">📧</span>
          <b>Email:</b>
          {isEditing ? (
            <input
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="trainer-profile-edit-input"
            />
          ) : (
            <span>{user.email}</span>
          )}
        </div>

        <div className="trainer-profile-edit-group">
          <span className="profile-item-icon">📞</span>
          <b>Số điện thoại:</b>
          {isEditing ? (
            <input
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              className="trainer-profile-edit-input"
            />
          ) : (
            <span>{user.phone}</span>
          )}
        </div>

        <div className="trainer-profile-edit-group">
          <span className="profile-item-icon">🎂</span>
          <b>Ngày sinh:</b>
          {isEditing ? (
            <input
              name="date_of_birth"
              type="date"
              value={formData.date_of_birth || ''}
              onChange={handleChange}
              className="trainer-profile-edit-input"
            />
          ) : (
            <span>{user.date_of_birth}</span>
          )}
        </div>

        <div className="trainer-profile-edit-group">
          <span className="profile-item-icon">🏠</span>
          <b>Địa chỉ:</b>
          {isEditing ? (
            <input
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              className="trainer-profile-edit-input"
            />
          ) : (
            <span>{user.address}</span>
          )}
        </div>

        <div className="trainer-profile-edit-actions">
          {isEditing ? (
            <>
              <button
                className="trainer-profile-edit-button"
                onClick={handleSave}
                style={{ marginRight: '8px' }}
              >
                💾 Lưu
              </button>
              <button
                className="trainer-profile-edit-button cancel"
                onClick={handleCancel}
              >
                ❌ Hủy
              </button>
            </>
          ) : (
            <button
              className="trainer-profile-edit-button"
              onClick={handleEdit}
            >
              ✏️ Chỉnh sửa thông tin
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
