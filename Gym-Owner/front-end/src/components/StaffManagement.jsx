import React, { useState, useEffect } from 'react';

const initialStaffs = [
  { id: 1, role: 'Admin', username: 'tumroyal', password: 's123123', phone: '0123456789', email: 'tum@example.com' },
  { id: 2, role: 'Trainer', username: 'jane_smith', password: 'pass456', phone: '0987654321', email: 'jane@example.com' },
  { id: 3, role: 'Trainer', username: 'bob_johnson', password: 'mypassword', phone: '1234567890', email: 'pro@gmail.com' },
  { id: 4, role: 'Admin', username: 'alice_brown', password: 'adminpass', phone: '2345678901', email: 'tum@gmail.com' },
];

const StaffManagement = () => {
  const [staffs, setStaffs] = useState(initialStaffs);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStaff, setEditingStaff] = useState(null);

  const filteredStaffs = staffs.filter(s =>
    s.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this staff?')) {
      setStaffs(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleAdd = () => {
    alert('Open add staff form here');
  };

  const handleEdit = (id) => {
    const staff = staffs.find(s => s.id === id);
    setEditingStaff({ ...staff });
  };

  const handleSave = () => {
    setStaffs(prev =>
      prev.map(s => s.id === editingStaff.id ? editingStaff : s)
    );
    setEditingStaff(null);
  };

  return (
    <div style={{ padding: '20px', flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Staff Management</h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input
            type="text"
            placeholder="Search by username, email, or role..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ padding: '5px 10px', fontSize: 14, borderRadius: 4, border: '1px solid #ccc' }}
          />
          <button
            onClick={handleAdd}
            style={{
              backgroundColor: '#28a745',
              border: 'none',
              borderRadius: '50%',
              width: 30,
              height: 30,
              color: 'white',
              fontWeight: 'bold',
              fontSize: 24,
              cursor: 'pointer',
              lineHeight: 1,
            }}
            title="Add Staff"
          >
            +
          </button>
        </div>
      </div>

      <table style={{ width: '100%', marginTop: 20, borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4' }}>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Role</th>
            <th style={thStyle}>Username</th>
            <th style={thStyle}>Password</th>
            <th style={thStyle}>Phone</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Edit</th>
            <th style={thStyle}>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredStaffs.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center', padding: 20 }}>No staff found.</td>
            </tr>
          ) : (
            filteredStaffs.map(staff => (
              <tr key={staff.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={tdStyle}>{staff.id}</td>
                <td style={tdStyle}>{staff.role}</td>
                <td style={tdStyle}>{staff.username}</td>
                <td style={tdStyle}>{'•'.repeat(staff.password.length)}</td>
                <td style={tdStyle}>{staff.phone}</td>
                <td style={tdStyle}>{staff.email}</td>
                <td style={tdStyle}>
                  <button onClick={() => handleEdit(staff.id)} style={btnEditStyle}>Edit</button>
                </td>
                <td style={tdStyle}>
                  <button onClick={() => handleDelete(staff.id)} style={btnDeleteStyle}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {editingStaff && (
        <div style={{ marginTop: 30 }}>
          <h3>Edit Staff</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 400 }}>
            <input
              type="text"
              placeholder="Username"
              value={editingStaff.username}
              onChange={e => setEditingStaff({ ...editingStaff, username: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              value={editingStaff.password}
              onChange={e => setEditingStaff({ ...editingStaff, password: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={editingStaff.email}
              onChange={e => setEditingStaff({ ...editingStaff, email: e.target.value })}
            />
            <input
              type="text"
              placeholder="Phone"
              value={editingStaff.phone}
              onChange={e => setEditingStaff({ ...editingStaff, phone: e.target.value })}
            />
            <input
              type="text"
              placeholder="Role"
              value={editingStaff.role}
              onChange={e => setEditingStaff({ ...editingStaff, role: e.target.value })}
            />
            <div>
              <button onClick={handleSave} style={{ marginRight: 10, backgroundColor: '#007bff', color: 'white', padding: '5px 10px' }}>Save</button>
              <button onClick={() => setEditingStaff(null)} style={{ backgroundColor: '#ccc', padding: '5px 10px' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const thStyle = {
  padding: '10px',
  borderBottom: '2px solid #ddd',
  textAlign: 'left',
};

const tdStyle = {
  padding: '10px',
};

const btnEditStyle = {
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  padding: '5px 10px',
  borderRadius: 4,
  cursor: 'pointer',
};

const btnDeleteStyle = {
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  padding: '5px 10px',
  borderRadius: 4,
  cursor: 'pointer',
};

export default StaffManagement;
