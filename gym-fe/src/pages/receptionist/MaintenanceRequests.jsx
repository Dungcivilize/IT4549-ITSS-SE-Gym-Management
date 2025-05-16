import React, { useEffect, useState } from 'react';

export default function MaintenanceRequests() {
  const [requests, setRequests] = useState([]);
  const [equipmentId, setEquipmentId] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/api/maintenance-requests')
      .then(res => res.json())
      .then(setRequests)
      .catch(console.error);
  }, []);

  const handleCreate = () => {
    fetch('http://localhost:8080/api/maintenance-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        equipment: { equipmentId: Number(equipmentId) },
        receptionist: { receptionistId: 1 }, // bạn có thể lấy từ login thực tế
        requestDate: new Date().toISOString().split('T')[0],
        status: 'Pending',
        notes,
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Tạo yêu cầu thất bại');
        return res.json();
      })
      .then(data => {
        setRequests(prev => [...prev, data]);
        setMessage('Tạo yêu cầu thành công');
        setEquipmentId('');
        setNotes('');
      })
      .catch(err => setMessage(err.message));
  };

  return (
    <div>
      <h1>Yêu cầu bảo trì thiết bị</h1>
      <div>
        <input
          type="number"
          placeholder="Equipment ID"
          value={equipmentId}
          onChange={e => setEquipmentId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Ghi chú"
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
        <button onClick={handleCreate}>Tạo yêu cầu</button>
      </div>

      {message && <p>{message}</p>}

      <ul>
        {requests.map(r => (
          <li key={r.requestId}>
            Thiết bị: {r.equipment?.equipmentId || 'N/A'}, Trạng thái: {r.status}, Ghi chú: {r.notes}
          </li>
        ))}
      </ul>
    </div>
  );
}
