import React, { useEffect, useState } from "react";
import './ReceptionistProfile.css';

export default function ReceptionistProfile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      setError('Bạn chưa đăng nhập');
      return;
    }
    let user = null;
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      setError('Dữ liệu user không hợp lệ');
      return;
    }

    setUsername(user.user_name);

    fetch(`http://localhost:8080/api/receptionist/profile?username=${user.user_name}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => {
        if (!res.ok) throw new Error('Lỗi khi lấy profile');
        return res.json();
      })
      .then(data => {
        setProfile(data);
        setFormData({
          fullname: data.fullname || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
        });
      })
      .catch(err => setError(err.message));
  }, []);

  if (error) {
    return <div className="receptionist-profile-message-error">Error: {error}</div>;
  }

  if (!profile) {
    return <div style={{ textAlign: 'center' }}>Loading profile...</div>;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    fetch(`http://localhost:8080/api/receptionist/profile/${username}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then(res => {
        setSaving(false);
        if (!res.ok) throw new Error('Lỗi khi cập nhật thông tin');
        return res.json();
      })
      .then(data => {
        setProfile(data);
        setEditMode(false);
        setSaveSuccess('Cập nhật thành công!');
      })
      .catch(err => {
        setSaveError(err.message);
      });
  }

  return (
    <div className="receptionist-profile-container">
      <h2>Receptionist Profile</h2>

      {!editMode ? (
        <>
          <div className="receptionist-profile-info"><strong>Full Name:</strong> {profile.fullname}</div>
          <div className="receptionist-profile-info"><strong>Email:</strong> {profile.email}</div>
          <div className="receptionist-profile-info"><strong>Phone:</strong> {profile.phone}</div>
          <div className="receptionist-profile-info"><strong>Address:</strong> {profile.address}</div>
          <div className="receptionist-profile-info">
            <strong>Date of Birth:</strong> {profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : ''}
          </div>
          <button className="receptionist-profile-edit-btn" onClick={() => setEditMode(true)}>Chỉnh sửa thông tin</button>
        </>
      ) : (
        <form onSubmit={handleSave}>
          <div className="receptionist-profile-field">
            <label htmlFor="fullname">Full Name:</label>
            <input
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              required
              placeholder="Nhập họ tên"
            />
          </div>

          <div className="receptionist-profile-field">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Nhập email"
            />
          </div>

          <div className="receptionist-profile-field">
            <label htmlFor="phone">Phone:</label>
            <input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
            />
          </div>

          <div className="receptionist-profile-field">
            <label htmlFor="address">Address:</label>
            <input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Nhập địa chỉ"
            />
          </div>

          <div className="receptionist-profile-field">
            <label htmlFor="dateOfBirth">Date of Birth:</label>
            <input
              id="dateOfBirth"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </div>

          {saveError && <div className="receptionist-profile-message-error">Error: {saveError}</div>}
          {saveSuccess && <div className="receptionist-profile-message-success">{saveSuccess}</div>}

          <div className="receptionist-profile-button-group">
            <button type="submit" className="receptionist-profile-button receptionist-profile-save-btn" disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu'}
            </button>
            <button
              type="button"
              className="receptionist-profile-button receptionist-profile-cancel-btn"
              onClick={() => setEditMode(false)}
              disabled={saving}
            >
              Hủy
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
