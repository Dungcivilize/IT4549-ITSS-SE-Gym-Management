import React from 'react';

export default function MemberList({ members, onEdit, onReload }) {
  const handleDelete = (userId) => {
    if (!window.confirm('Bạn có chắc muốn xóa?')) return;

    fetch(`http://localhost:8080/api/receptionist/members/${userId}`, {
      method: 'DELETE',
    })
      .then(res => {
        if (!res.ok) throw new Error('Xóa thất bại');
        onReload();
      })
      .catch(err => alert(err.message));
  };

  // Format ngày sinh dd/mm/yyyy
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN');
  };

  return (
    <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Danh sách thành viên</h2>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}>
        <thead>
          <tr style={{ backgroundColor: '#667eea', color: 'white' }}>
            <th style={thStyle}>Tên</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Phone</th>
            <th style={thStyle}>Địa chỉ</th>
            <th style={thStyle}>Ngày sinh</th>
            <th style={thStyle}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {members.map(m => (
            <tr key={m.memberId} style={trStyle} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0f4ff'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
              <td style={tdStyle}>{m.fullname}</td>
              <td style={tdStyle}>{m.email}</td>
              <td style={tdStyle}>{m.phone}</td>
              <td style={tdStyle}>{m.address}</td>
              <td style={tdStyle}>{formatDate(m.dateOfBirth)}</td>
              <td style={{ ...tdStyle, display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={() => onEdit(m)} style={btnEditStyle}>Sửa</button>
                <button onClick={() => handleDelete(m.userId)} style={btnDeleteStyle}>Xóa</button>
              </td>
            </tr>
          ))}
          {members.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                Không có thành viên nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  padding: '12px 15px',
  textAlign: 'center',
  fontWeight: '600',
  fontSize: '16px',
};

const tdStyle = {
  padding: '12px 15px',
  borderBottom: '1px solid #ddd',
  textAlign: 'center',
  fontSize: '14px',
};

const trStyle = {
  transition: 'background-color 0.3s ease',
};

const btnBase = {
  padding: '6px 14px',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '14px',
};

const btnEditStyle = {
  ...btnBase,
  backgroundColor: '#4caf50',
  color: 'white',
};

const btnDeleteStyle = {
  ...btnBase,
  backgroundColor: '#f44336',
  color: 'white',
};
