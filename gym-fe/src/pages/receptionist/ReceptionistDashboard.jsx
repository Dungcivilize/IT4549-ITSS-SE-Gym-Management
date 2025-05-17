import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ReceptionistDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    membersCount: 0,
    maintenanceRequestsCount: 0,
    todayCheckIns: 0,
  });

  useEffect(() => {
    fetch('http://localhost:8080/api/receptionists/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error);
  }, []);

  return (
    <div 
      style={{ 
        width: '100%',
        maxWidth: '800px', 
        margin: '40px auto',
        padding: '20px', 
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Receptionist Dashboard</h1>

      {/*nút Quản lý thành viên */}
      <button
        onClick={() => navigate('/receptionist/members')}
        style={{
          padding: '12px 20px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          border: '1px solid #667eea',
          backgroundColor: '#667eea',
          color: 'white',
          minWidth: '200px',
          boxSizing: 'border-box',
          marginBottom: '20px',
          ...buttonStyle,
        }}
      >
        Quản lý thành viên
      </button>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '15px', 
        marginBottom: '40px',
        flexWrap: 'wrap',
        width: '100%',
        alignItems: 'center',
      }}>
        <button
          onClick={() => navigate('/receptionist/checkin-checkout')}
          style={buttonStyle}
        >
          Check-in / Check-out
        </button>
        <button
          onClick={() => navigate('/receptionist/maintenance-requests')}
          style={buttonStyle}
        >
          Quản lý yêu cầu bảo trì
        </button>
      </div>

      {/* Stats cards */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '25px',
        flexWrap: 'wrap',
        width: '100%',
      }}>
        <StatCard title="Số thành viên" value={stats.membersCount} />
        <StatCard title="Yêu cầu bảo trì" value={stats.maintenanceRequestsCount} />
        <StatCard title="Check-in hôm nay" value={stats.todayCheckIns} />
      </div>
    </div>
  );
}

const buttonStyle = {
  backgroundColor: '#667eea',
  border: 'none',
  padding: '12px 20px',
  borderRadius: '8px',
  color: 'white',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: '600',
  boxShadow: '0 4px 8px rgba(102, 126, 234, 0.4)',
  transition: 'background-color 0.3s ease',
  minWidth: '200px', 
  textAlign: 'center',
};

function StatCard({ title, value }) {
  return (
    <div style={{
      minWidth: '180px',
      padding: '20px 30px',
      backgroundColor: '#f5f7ff',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      textAlign: 'center',
      userSelect: 'none',
      flex: '1',
      maxWidth: '220px',
    }}>
      <div style={{ fontSize: '22px', fontWeight: '700', color: '#333' }}>{value}</div>
      <div style={{ marginTop: '8px', fontSize: '16px', color: '#666' }}>{title}</div>
    </div>
  );
}
