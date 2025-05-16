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

  const handleSubmit = () => {
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
      .then(() => onSuccess())
      .catch(err => alert(err.message));
  };

  return (
    <div>
      <h2>{member ? 'Chỉnh sửa thành viên' : 'Thêm thành viên mới'}</h2>
      <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
      <input name="fullname" placeholder="Full Name" value={formData.fullname} onChange={handleChange} />
      <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
      <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
      {!member && (
        <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} />
      )}
      <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
      <input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
      <button onClick={handleSubmit}>{member ? 'Cập nhật' : 'Thêm mới'}</button>
    </div>
  );
}
