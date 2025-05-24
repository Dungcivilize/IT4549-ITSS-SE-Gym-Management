import React, { useEffect, useState } from 'react';

const GymRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({ name: '', location: '', capacity: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchRooms = () => {
    fetch('http://localhost:8080/api/gymrooms')
      .then(res => res.json())
      .then(data => setRooms(data))
      .catch(err => console.error('Lỗi khi tải phòng:', err));
  };

  useEffect(() => {
    fetchRooms();
  }, []);

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
      body: JSON.stringify({ ...form, capacity: parseInt(form.capacity) })
    })
      .then(res => res.json())
      .then(() => {
        fetchRooms();
        setForm({ name: '', location: '', capacity: '' });
        setEditingId(null);
      })
      .catch(err => console.error('Lỗi khi lưu phòng:', err));
  };

  const handleEdit = room => {
    setForm({ name: room.name, location: room.location, capacity: room.capacity });
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

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          name="name"
          placeholder="Tên phòng"
          value={form.name}
          onChange={handleChange}
          required
          style={{ marginRight: '10px' }}
        />
        <input
          type="text"
          name="location"
          placeholder="Vị trí"
          value={form.location}
          onChange={handleChange}
          required
          style={{ marginRight: '10px' }}
        />
        <input
          type="number"
          name="capacity"
          placeholder="Sức chứa"
          value={form.capacity}
          onChange={handleChange}
          required
          style={{ marginRight: '10px', width: '100px' }}
        />
        <button type="submit">{editingId ? 'Cập nhật' : 'Thêm mới'}</button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({ name: '', location: '', capacity: '' });
            }}
            style={{ marginLeft: '10px' }}
          >
            Huỷ
          </button>
        )}
      </form>

      <table border="1" cellPadding="10" style={{ width: '100%', backgroundColor: 'white' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên phòng</th>
            <th>Vị trí</th>
            <th>Sức chứa</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map(room => (
            <tr key={room.id}>
              <td>{room.id}</td>
              <td>{room.name}</td>
              <td>{room.location}</td>
              <td>{room.capacity}</td>
              <td>
                <button onClick={() => handleEdit(room)}>Sửa</button>
                <button onClick={() => handleDelete(room.id)} style={{ marginLeft: '10px' }}>
                  Xoá
                </button>
              </td>
            </tr>
          ))}
          {rooms.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>
                Không có phòng nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GymRooms;
