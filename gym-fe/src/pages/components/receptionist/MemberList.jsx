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

  return (
    <div>
      <h2>Danh sách thành viên</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Địa chỉ</th>
            <th>Ngày sinh</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {members.map(m => (
            <tr key={m.memberId}>
              <td>{m.fullname}</td>
              <td>{m.email}</td>
              <td>{m.phone}</td>
              <td>{m.address}</td>
              <td>{m.dateOfBirth}</td>
              <td>
                <button onClick={() => onEdit(m)}>Sửa</button>
                <button onClick={() => handleDelete(m.userId)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
