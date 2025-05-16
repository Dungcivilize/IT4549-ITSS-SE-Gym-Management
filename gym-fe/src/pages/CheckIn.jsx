import React, { useState } from 'react';

export default function CheckIn() {
  const [memberId, setMemberId] = useState('');
  const [message, setMessage] = useState('');

  const handleCheckIn = () => {
    fetch('http://localhost:8080/api/attendance/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId: Number(memberId) }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Check-in thất bại');
        return res.json();
      })
      .then(() => setMessage('Check-in thành công!'))
      .catch(err => setMessage(err.message));
  };

  return (
    <div>
      <h1>Check-in thành viên</h1>
      <input
        type="number"
        placeholder="Nhập Member ID"
        value={memberId}
        onChange={e => setMemberId(e.target.value)}
      />
      <button onClick={handleCheckIn}>Check-in</button>
      {message && <p>{message}</p>}
    </div>
  );
}
