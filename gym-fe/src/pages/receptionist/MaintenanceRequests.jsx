import React, { useEffect, useState } from 'react';

export default function MaintenanceRequests() {
  const [requests, setRequests] = useState([]);
  const [equipmentId, setEquipmentId] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch('http://localhost:8080/api/maintenance-requests')
      .then(res => {
        if (!res.ok) throw new Error('Lỗi tải dữ liệu');
        return res.json();
      })
      .then(setRequests)
      .catch(err => setMessage({ text: err.message, type: 'error' }))
      .finally(() => setIsLoading(false));
  }, []);

  const handleCreateRequest = async () => {
    if (!equipmentId) {
      setMessage({ text: 'Vui lòng nhập Equipment ID', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch('http://localhost:8080/api/maintenance-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equipment: { equipmentId: Number(equipmentId) },
          receptionist: { receptionistId: 1 },
          requestDate: new Date().toISOString().split('T')[0],
          status: 'Pending',
          notes,
        }),
      });

      if (!res.ok) throw new Error('Tạo yêu cầu thất bại');
      
      const newRequest = await res.json();
      setRequests(prev => [newRequest, ...prev]);
      setMessage({ text: 'Tạo yêu cầu thành công!', type: 'success' });
      setEquipmentId('');
      setNotes('');
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div style={containerStyle}>
      {/* Form tạo yêu cầu */}
      <div style={formContainerStyle}>
        <h2 style={sectionTitleStyle}>Tạo yêu cầu bảo trì mới</h2>
        
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Equipment ID</label>
          <input
            type="number"
            placeholder="Nhập ID thiết bị"
            value={equipmentId}
            onChange={e => setEquipmentId(e.target.value)}
            style={inputStyle}
            disabled={isSubmitting}
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Ghi chú</label>
          <textarea
            placeholder="Mô tả vấn đề..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            style={{ ...inputStyle, minHeight: '100px' }}
            disabled={isSubmitting}
          />
        </div>

        <button 
          onClick={handleCreateRequest}
          style={{
            ...buttonStyle,
            backgroundColor: isSubmitting ? '#718096' : '#4C51BF',
            opacity: isSubmitting ? 0.7 : 1,
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
        </button>

        {message.text && (
          <div style={{
            ...messageStyle,
            backgroundColor: message.type === 'success' ? '#F0FFF4' : '#FFF5F5',
            color: message.type === 'success' ? '#2F855A' : '#C53030',
            borderLeft: `4px solid ${message.type === 'success' ? '#48BB78' : '#F56565'}`
          }}>
            {message.text}
          </div>
        )}
      </div>

      {/* Danh sách yêu cầu */}
      <div style={listContainerStyle}>
        <h2 style={sectionTitleStyle}>Danh sách yêu cầu bảo trì</h2>
        
        {isLoading ? (
          <div style={loadingStyle}>Đang tải dữ liệu...</div>
        ) : requests.length === 0 ? (
          <div style={emptyStateStyle}>Không có yêu cầu nào</div>
        ) : (
          <div style={tableContainerStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>ID</th>
                  <th style={tableHeaderStyle}>Thiết bị</th>
                  <th style={tableHeaderStyle}>Ngày yêu cầu</th>
                  <th style={tableHeaderStyle}>Trạng thái</th>
                  <th style={tableHeaderStyle}>Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(request => (
                  <tr key={request.requestId} style={tableRowStyle}>
                    <td style={tableCellStyle}>#{request.requestId}</td>
                    <td style={tableCellStyle}>{request.equipment?.equipmentId || 'N/A'}</td>
                    <td style={tableCellStyle}>{new Date(request.requestDate).toLocaleDateString()}</td>
                    <td style={tableCellStyle}>
                      <span style={{
                        ...statusBadgeStyle,
                        ...getStatusStyle(request.status)
                      }}>
                        {request.status}
                      </span>
                    </td>
                    <td style={{ ...tableCellStyle, maxWidth: '200px' }}>{request.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Utility function for status styles
const getStatusStyle = (status) => {
  const baseStyle = {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    display: 'inline-block'
  };

  switch (status) {
    case 'Completed':
      return { ...baseStyle, backgroundColor: '#C6F6D5', color: '#22543D' };
    case 'In Progress':
      return { ...baseStyle, backgroundColor: '#BEE3F8', color: '#2A4365' };
    case 'Pending':
      return { ...baseStyle, backgroundColor: '#FEFCBF', color: '#744210' };
    case 'Cancelled':
      return { ...baseStyle, backgroundColor: '#FED7D7', color: '#742A2A' };
    default:
      return { ...baseStyle, backgroundColor: '#E2E8F0', color: '#1A202C' };
  }
};

// Styles
const containerStyle = {
  maxWidth: '1200px',
  margin: '2rem auto',
  padding: '0 1rem',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
};

const formContainerStyle = {
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: '2rem',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  marginBottom: '2rem'
};

const listContainerStyle = {
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: '2rem',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
};

const sectionTitleStyle = {
  fontSize: '1.5rem',
  fontWeight: '600',
  color: '#2D3748',
  marginBottom: '1.5rem',
  paddingBottom: '0.5rem',
  borderBottom: '1px solid #EDF2F7'
};

const inputGroupStyle = {
  marginBottom: '1.5rem'
};

const labelStyle = {
  display: 'block',
  marginBottom: '0.5rem',
  fontWeight: '600',
  color: '#4A5568',
  fontSize: '0.95rem'
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: '8px',
  border: '1px solid #E2E8F0',
  fontSize: '1rem',
  transition: 'border-color 0.3s, box-shadow 0.3s',
  ':focus': {
    outline: 'none',
    borderColor: '#667EEA',
    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.2)'
  }
};

const buttonStyle = {
  padding: '0.75rem 1.5rem',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: '#4C51BF',
  color: 'white',
  fontWeight: '600',
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  ':hover': {
    backgroundColor: '#434190',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.15)'
  },
  ':active': {
    transform: 'translateY(0)'
  }
};

const messageStyle = {
  marginTop: '1.5rem',
  padding: '1rem',
  borderRadius: '6px',
  fontSize: '0.95rem',
  lineHeight: '1.5'
};

const loadingStyle = {
  padding: '2rem',
  textAlign: 'center',
  color: '#718096'
};

const emptyStateStyle = {
  padding: '2rem',
  textAlign: 'center',
  color: '#718096',
  border: '1px dashed #E2E8F0',
  borderRadius: '8px'
};

const tableContainerStyle = {
  overflowX: 'auto'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse'
};

const tableHeaderStyle = {
  padding: '1rem',
  textAlign: 'left',
  backgroundColor: '#F7FAFC',
  color: '#4A5568',
  fontWeight: '600',
  borderBottom: '1px solid #E2E8F0'
};

const tableRowStyle = {
  borderBottom: '1px solid #EDF2F7',
  ':hover': {
    backgroundColor: '#F8FAFC'
  }
};

const tableCellStyle = {
  padding: '1rem',
  verticalAlign: 'top'
};

const statusBadgeStyle = {
  padding: '4px 12px',
  borderRadius: '12px',
  fontSize: '14px',
  fontWeight: '600',
  display: 'inline-block'
};