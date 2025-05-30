import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const GymRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({ roomName: '', roomType: '', status: '' });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRooms = () => {
    fetch('http://localhost:8080/api/gymrooms')
      .then(res => res.json())
      .then(data => {
        console.log("Dữ liệu nhận được từ API:", data);
        setRooms(data);
      })
      .catch(err => console.error('Lỗi khi tải phòng:', err));
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Chuyển sang dùng trường roomName, roomType, status và kiểm tra undefined tránh lỗi
  const filteredRooms = rooms.filter(room =>
    (room.roomName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (room.roomType || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (room.status || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const url = editingId
      ? `http://localhost:8080/api/gymrooms/${editingId}`
      : 'http://localhost:8080/api/gymrooms';
    const method = editingId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)  // Không có capacity nên gửi nguyên form
    })
      .then(res => res.json())
      .then(() => {
        fetchRooms();
        setForm({ roomName: '', roomType: '', status: '' });
        setEditingId(null);
      })
      .catch(err => console.error('Lỗi khi lưu phòng:', err));
  };

  const handleEdit = room => {
    setForm({
      roomName: room.roomName || '',
      roomType: room.roomType || '',
      status: room.status || ''
    });
    setEditingId(room.id);
  };

  const handleDelete = id => {
    if (window.confirm('Bạn có chắc chắn muốn xoá phòng này?')) {
      fetch(`http://localhost:8080/api/gymrooms/${id}`, {
        method: 'DELETE'
      })
        .then(() => fetchRooms())
        .catch(err => console.error('Lỗi khi xoá phòng:', err));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Quản lý phòng tập</h2>
      <h3>Thêm phòng tập mới</h3>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          name="roomName"
          placeholder="Tên phòng"
          value={form.roomName}
          onChange={handleChange}
          required
          style={{ marginRight: '10px' }}
        />
        <input
          type="text"
          name="roomType"
          placeholder="Loại phòng"
          value={form.roomType}
          onChange={handleChange}
          required
          style={{ marginRight: '10px' }}
        />
        <input
          type="text"
          name="status"
          placeholder="Trạng thái"
          value={form.status}
          onChange={handleChange}
          required
          style={{ marginRight: '10px', width: '150px' }}
        />
        <button type="submit">{editingId ? 'Cập nhật' : 'Thêm mới'}</button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({ roomName: '', roomType: '', status: '' });
            }}
            style={{ marginLeft: '10px' }}
          >
            Huỷ
          </button>
        )}
      </form>

      <h3>Tìm kiếm phòng tập</h3>
      <input
        type="text"
        placeholder="Tìm theo tên phòng, loại phòng hoặc trạng thái..."
        autoComplete="off"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ padding: "5px 10px", marginBottom: 15, width: 300 }}
      />

      <h3>Danh sách phòng tập</h3>
      <div style={{ maxHeight: 800, overflowY: "auto" }}>
        <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên phòng</th>
              <th>Loại phòng</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredRooms.length > 0 ? (
              filteredRooms.map(room => (
                <tr key={room.id}>
                  <td>{room.id}</td>
                  <td>{room.roomName}</td>
                  <td>{room.roomType}</td>
                  <td>{room.status}</td>
                  <td>
                    <button onClick={() => handleEdit(room)}>Sửa</button>
                    <button onClick={() => handleDelete(room.id)} style={{ marginLeft: 10 }}>Xoá</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  Không có phòng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GymRooms;
