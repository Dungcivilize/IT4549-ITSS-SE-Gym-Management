import React, { useState, useEffect } from 'react';

function GymRoomList() {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({
    roomName: '',
    roomType: '',
    status: ''
  });

  // Lấy danh sách phòng tập
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = () => {
    fetch('http://localhost:8080/api/gymrooms')
      .then(res => res.json())
      .then(data => setRooms(data));
  };

  // Thêm phòng tập mới
  const handleCreate = () => {
    fetch('http://localhost:8080/api/gymrooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRoom),
    }).then(() => {
      setNewRoom({ roomName: '', roomType: '', status: '' });
      fetchRooms();
    });
  };

  // Xoá phòng
  const handleDelete = (id) => {
    fetch(`http://localhost:8080/api/gymrooms/${id}`, {
      method: 'DELETE',
    }).then(() => fetchRooms());
  };

  return (
    <div>
      <h2>Danh sách phòng tập</h2>
      <ul>
        {rooms.map(room => (
          <li key={room.roomId}>
            {room.roomName} | {room.roomType} | {room.status}
            <button onClick={() => handleDelete(room.roomId)}>Xoá</button>
          </li>
        ))}
      </ul>

      <h3>Thêm phòng mới</h3>
      <input
        placeholder="Tên phòng"
        value={newRoom.roomName}
        onChange={(e) => setNewRoom({ ...newRoom, roomName: e.target.value })}
      />
      <input
        placeholder="Loại phòng"
        value={newRoom.roomType}
        onChange={(e) => setNewRoom({ ...newRoom, roomType: e.target.value })}
      />
      <input
        placeholder="Trạng thái"
        value={newRoom.status}
        onChange={(e) => setNewRoom({ ...newRoom, status: e.target.value })}
      />
      <button onClick={handleCreate}>Tạo phòng</button>
    </div>
  );
}

export default GymRoomList;
