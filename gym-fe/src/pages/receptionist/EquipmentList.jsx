import React, { useEffect, useState } from 'react';

export default function EquipmentList() {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/equipments')
      .then(res => {
        if (!res.ok) throw new Error('Không thể tải danh sách thiết bị');
        return res.json();
      })
      .then(data => {
        setEquipments(data);
        setLoading(false);
      })
      .catch(err => {
        alert(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Danh sách thiết bị</h2>
      {loading ? (
        <p style={{ textAlign: 'center' }}>Đang tải...</p>
      ) : equipments.length === 0 ? (
        <p style={{ textAlign: 'center' }}>Không có thiết bị nào.</p>
      ) : (
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}>
          <thead>
            <tr style={{ backgroundColor: '#667eea', color: 'white' }}>
              <th style={thStyle}>Tên thiết bị</th>
              <th style={thStyle}>Nhà sản xuất</th>
              <th style={thStyle}>Số lượng</th>
            </tr>
          </thead>
          <tbody>
            {equipments.map(eq => (
              <tr key={eq.equipmentId} style={trStyle} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0f4ff'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <td style={tdStyle}>{eq.equipmentName}</td>
                <td style={tdStyle}>{eq.manufacturer}</td>
                <td style={tdStyle}>{eq.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
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
