import React, { useEffect, useState } from 'react';
import styles from '../../assets/css/MemberHomePage.module.css';
import MemberNavbar from '../../Components/MemberNavbar';

const MemberProfile = () => {
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
    <div style={{
      minHeight: '100vh',
      padding: '2rem',
      backgroundColor: '#111317',
      background: 'radial-gradient(circle, rgba(249, 172, 84, 0.3) 0%, rgba(15, 15, 15, 0.95) 70%, #111317 100%)',
      fontFamily: 'Poppins, sans-serif'
    }}>
      <MemberNavbar />
      <div className={styles.profileBox}>
        <h2 style={{ color: '#f9ac54', textAlign: 'center' }}>
          Thông tin hội viên
        </h2>
        {success && (
          <div style={{ color: 'green', textAlign: 'center' }}>{success}</div>
        )}
        {error && (
          <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>
        )}
        <div className={styles.profileItem}>
          <span className={styles.profileItemIcon}>👤</span>
          <b>Tên đăng nhập:</b>
          {isEditing ? (
            <input
              name="user_name"
              value={formData.user_name || ''}
              onChange={handleChange}
              style={{ marginLeft: 8 }}
            />
          ) : (
            <span style={{ marginLeft: 8 }}>{user.user_name}</span>
          )}
        </div>
        <div className={styles.profileItem}>
          <span className={styles.profileItemIcon}>📝</span>
          <b>Họ tên:</b>
          {isEditing ? (
            <input
              name="fullname"
              value={formData.fullname || ''}
              onChange={handleChange}
              style={{ marginLeft: 8 }}
            />
          ) : (
            <span style={{ marginLeft: 8 }}>{user.fullname}</span>
          )}
        </div>
        <div className={styles.profileItem}>
          <span className={styles.profileItemIcon}>📧</span>
          <b>Email:</b>
          {isEditing ? (
            <input
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              style={{ marginLeft: 8 }}
            />
          ) : (
            <span style={{ marginLeft: 8 }}>{user.email}</span>
          )}
        </div>
        <div className={styles.profileItem}>
          <span className={styles.profileItemIcon}>📞</span>
          <b>Số điện thoại:</b>
          {isEditing ? (
            <input
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              style={{ marginLeft: 8 }}
            />
          ) : (
            <span style={{ marginLeft: 8 }}>{user.phone}</span>
          )}
        </div>
        <div className={styles.profileItem}>
          <span className={styles.profileItemIcon}>🎂</span>
          <b>Ngày sinh:</b>
          {isEditing ? (
            <input
              name="date_of_birth"
              type="date"
              value={formData.date_of_birth || ''}
              onChange={handleChange}
              style={{ marginLeft: 8 }}
            />
          ) : (
            <span style={{ marginLeft: 8 }}>{user.date_of_birth}</span>
          )}
        </div>
        <div className={styles.profileItem}>
          <span className={styles.profileItemIcon}>🏠</span>
          <b>Địa chỉ:</b>
          {isEditing ? (
            <input
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              style={{ marginLeft: 8 }}
            />
          ) : (
            <span style={{ marginLeft: 8 }}>{user.address}</span>
          )}
        </div>
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          {isEditing ? (
            <>
              <button
                className={styles.btn}
                onClick={handleSave}
                style={{ marginRight: 8 }}
              >
                Lưu
              </button>
              <button
                className={styles.btn}
                onClick={handleCancel}
                style={{ background: '#888' }}
              >
                Hủy
              </button>
            </>
          ) : (
            <button className={styles.btn} onClick={handleEdit}>
              Chỉnh sửa thông tin
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;
