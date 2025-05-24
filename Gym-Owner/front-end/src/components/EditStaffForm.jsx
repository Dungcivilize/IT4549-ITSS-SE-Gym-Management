import React from 'react';

const EditStaffForm = ({ staff, onChange, onSave, onCancel }) => {
  return (
    <div style={{
      marginTop: '30px',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h2>Edit Staff</h2>
      <div style={{ display: 'grid', gap: '10px', maxWidth: '400px' }}>
        <input
          type="text"
          value={staff.username}
          onChange={e => onChange({ ...staff, username: e.target.value })}
          placeholder="Username"
        />
        <input
          type="password"
          value={staff.password}
          onChange={e => onChange({ ...staff, password: e.target.value })}
          placeholder="Password"
        />
        <input
          type="email"
          value={staff.email}
          onChange={e => onChange({ ...staff, email: e.target.value })}
          placeholder="Email"
        />
        <input
          type="tel"
          value={staff.phone}
          onChange={e => onChange({ ...staff, phone: e.target.value })}
          placeholder="Phone"
        />
        <input
          type="text"
          value={staff.role}
          onChange={e => onChange({ ...staff, role: e.target.value })}
          placeholder="Role"
        />
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onSave}
            style={{ backgroundColor: '#28a745', color: 'white', padding: '8px 16px', border: 'none', borderRadius: 4 }}
          >
            Save
          </button>
          <button
            onClick={onCancel}
            style={{ backgroundColor: '#ccc', padding: '8px 16px', border: 'none', borderRadius: 4 }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditStaffForm;
