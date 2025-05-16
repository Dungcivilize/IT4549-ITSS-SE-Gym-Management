import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ReceptionistDashboard() {
  const receptionistId = Number(localStorage.getItem('receptionistId')) || 1;
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    membersCount: 0,
    maintenanceRequestsCount: 0,
    todayCheckIns: 0,
  });

  const [requests, setRequests] = useState([]);
  const [equipmentId, setEquipmentId] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/api/receptionist/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch(`http://localhost:8080/api/maintenance-requests/receptionist/${receptionistId}`)
      .then(res => res.json())
      .then(setRequests)
      .catch(console.error);
  }, [receptionistId]);

  const handleCreateRequest = () => {
    fetch('http://localhost:8080/api/maintenance-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        equipment: { equipmentId: Number(equipmentId) },
        receptionist: { receptionistId },
        requestDate: new Date().toISOString().split('T')[0],
        status: 'Pending',
        notes,
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Tạo yêu cầu thất bại');
        return res.json();
      })
      .then(newRequest => {
        setRequests(prev => [...prev, newRequest]);
        setMessage('Tạo yêu cầu thành công');
        setEquipmentId('');
        setNotes('');
      })
      .catch(err => setMessage(err.message));
  };

  return (
    <div>
      <h1>Receptionist Dashboard</h1>

      {/* Điều hướng sang các trang khác */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => navigate('/receptionist/members')}>Quản lý thành viên</button>
        <button onClick={() => navigate('/receptionist/maintenance-requests')} style={{ marginLeft: '10px' }}>
          Quản lý yêu cầu bảo trì
        </button>
      </div>

      {/* Thống kê */}
      <ul>
        <li>Số thành viên: {stats.membersCount}</li>
        <li>Số yêu cầu bảo trì: {stats.maintenanceRequestsCount}</li>
        <li>Số check-in hôm nay: {stats.todayCheckIns}</li>
      </ul>

      {/* Form tạo yêu cầu bảo trì */}
      <h2>Tạo yêu cầu bảo trì mới</h2>
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
      <button onClick={handleCreateRequest}>Gửi yêu cầu</button>

      {message && <p>{message}</p>}

      {/* Danh sách yêu cầu */}
      <h2>Danh sách yêu cầu bảo trì của bạn</h2>
      <ul>
        {requests.map(r => (
          <li key={r.requestId}>
            Thiết bị: {r.equipment?.equipmentId}, Trạng thái: {r.status}, Ghi chú: {r.notes}
          </li>
        ))}
      </ul>
    </div>
  );
}
