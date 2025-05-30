import React, { useEffect, useState } from 'react';

const EquipmentPage = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [equipments, setEquipments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({
    name: '',
    quantity: '',
    manufacturer: ''
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch danh sách phòng
  const fetchRooms = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/gymrooms');
      const data = await res.json();
      setRooms(data);
    } catch (err) {
      console.error('Lỗi khi tải danh sách phòng:', err);
    }
  };

  // Fetch danh sách thiết bị theo phòng
  const fetchEquipments = async () => {
    if (!selectedRoom) return;
    try {
      const res = await fetch(`http://localhost:8080/api/rooms/${selectedRoom}/equipments`);
      const data = await res.json();
      setEquipments(data);
    } catch (err) {
      console.error('Lỗi khi tải thiết bị:', err);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    fetchEquipments();
  }, [selectedRoom]);

  const filteredEquipments = equipments.filter(eq =>
    (eq.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = {
      ...form,
      room: { id: selectedRoom }
    };

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId
      ? `http://localhost:8080/api/rooms/${selectedRoom}/equipments/${editingId}`
      : `http://localhost:8080/api/rooms/${selectedRoom}/equipments`;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Lỗi khi lưu thiết bị');
      }

      await fetchEquipments();
      resetForm();
    } catch (err) {
      console.error('Lỗi:', err);
      alert(`Lỗi: ${err.message}`);
    }
  };

  const resetForm = () => {
    setForm({ name: '', quantity: '', manufacturer: '' });
    setEditingId(null);
  };

  const handleEdit = equipment => {
    setForm({
      name: equipment.name || '',
      quantity: equipment.quantity || '',
      manufacturer: equipment.manufacturer || ''
    });
    setEditingId(equipment.id);
  };

  const handleDelete = async id => {
    if (!window.confirm('Bạn có chắc muốn xoá thiết bị này?')) return;

    try {
      const res = await fetch(`http://localhost:8080/api/rooms/${selectedRoom}/equipments/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Lỗi khi xoá thiết bị');
      }

      await fetchEquipments();
    } catch (err) {
      console.error('Lỗi:', err);
      alert(`Lỗi: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Quản lý thiết bị phòng tập</h2>

      <div style={{ marginBottom: '20px' }}>
        <label>Chọn phòng: </label>
        <select
          value={selectedRoom}
          onChange={(e) => setSelectedRoom(Number(e.target.value))}
          style={{ padding: '5px', width: '200px' }}
        >
          <option value="">-- Chọn phòng --</option>
          {rooms.map(room => (
            <option key={room.id} value={room.id}>
              {room.roomName}
            </option>
          ))}
        </select>
      </div>

      {selectedRoom && (
        <>
          <h3>{editingId ? 'Cập nhật thiết bị' : 'Thêm thiết bị mới'}</h3>
          <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
            <input
              type="text"
              name="name"
              placeholder="Tên thiết bị"
              value={form.name}
              onChange={handleChange}
              required
              style={{ marginRight: '10px' }}
            />
            <input
              type="number"
              name="quantity"
              placeholder="Số lượng"
              value={form.quantity}
              onChange={handleChange}
              required
              min="1"
              style={{ marginRight: '10px', width: '100px' }}
            />
            <input
              type="text"
              name="manufacturer"
              placeholder="Nhà sản xuất"
              value={form.manufacturer}
              onChange={handleChange}
              style={{ marginRight: '10px' }}
            />
            <button type="submit">{editingId ? 'Cập nhật' : 'Thêm mới'}</button>
            {editingId && (
              <button type="button" onClick={resetForm} style={{ marginLeft: '10px' }}>
                Huỷ
              </button>
            )}
          </form>

          <h3>Tìm kiếm thiết bị</h3>
          <input
            type="text"
            placeholder="Tìm theo tên thiết bị..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ padding: '5px 10px', marginBottom: 15, width: 300 }}
          />

          <h3>Danh sách thiết bị</h3>
          <div style={{ maxHeight: 800, overflowY: 'auto' }}>
            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên thiết bị</th>
                  <th>Số lượng</th>
                  <th>Nhà sản xuất</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredEquipments.length > 0 ? (
                  filteredEquipments.map(eq => (
                    <tr key={eq.id}>
                      <td>{eq.id}</td>
                      <td>{eq.name}</td>
                      <td>{eq.quantity}</td>
                      <td>{eq.manufacturer}</td>
                      <td>
                        <button onClick={() => handleEdit(eq)}>Sửa</button>
                        <button onClick={() => handleDelete(eq.id)} style={{ marginLeft: 10 }}>
                          Xoá
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>
                      {searchTerm
                        ? 'Không tìm thấy thiết bị phù hợp'
                        : 'Không có thiết bị nào trong phòng này'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default EquipmentPage;
