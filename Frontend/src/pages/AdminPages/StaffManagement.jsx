import React, { useEffect, useState } from 'react';
import axios from 'axios';

const emptyUserForm = {
  userName: '',
  password: '',
  email: '',
  phone: '',
  role: '',
  createdAt: '', // will use ISO string
  fullname: '',
  address: '',
  dateOfBirth: ''
};

const styles = {
  container: { maxWidth: '900px', margin: '0 auto', padding: '20px' },
  title: { textAlign: 'center', color: '#1e40af', fontSize: '2rem', fontWeight: 'bold', marginBottom: '30px' },
  button: { padding: '10px 15px', marginBottom: '20px', cursor: 'pointer', borderRadius: '5px', border: 'none', backgroundColor: '#3b82f6', color: '#fff' },
  form: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '40px' },
  input: { padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1rem' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' },
  th: { border: '1px solid #ddd', padding: '10px', backgroundColor: '#f3f4f6' },
  td: { border: '1px solid #ddd', padding: '8px', textAlign: 'left', verticalAlign: 'middle' },
  actionButtons: { display: 'flex', gap: '8px', justifyContent: 'center' },
  editButton: { backgroundColor: '#fbbf24', border: 'none', borderRadius: '4px', padding: '6px 12px', color: 'white', cursor: 'pointer' },
  deleteButton: { backgroundColor: '#ef4444', border: 'none', borderRadius: '4px', padding: '6px 12px', color: 'white', cursor: 'pointer' }
};

const StaffManagement = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null); // object or null
  const [addingNewUser, setAddingNewUser] = useState(false);
  const [addForm, setAddForm] = useState(emptyUserForm);

  // Load user list
  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle change for add form
  const handleAddFormChange = (e) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  const checkEmailExists = async (email) => {
    const res = await axios.get(`http://localhost:8080/api/users/check/email?email=${email}`);
    return res.data.exists; // true hoặc false
  };

  // Handle add new user submit
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      // createdAt: use current time if empty
      const newUser = {
        ...addForm,
        createdAt: addForm.createdAt || new Date().toISOString()
      };
      const emailExists = await checkEmailExists(newUser.email);
      if (emailExists) {
        window.alert("❌ Email đã tồn tại!");
        return;
      }
      await axios.post('http://localhost:8080/api/users', newUser);
      setAddingNewUser(false);
      setAddForm(emptyUserForm);
      fetchUsers();
      window.alert('✅ Thêm người dùng thành công!');
    } catch (err) {
      console.error('Error adding user:', err);
    }
  };

  // Handle edit form change
  const handleEditChange = (e) => {
    setEditingUser({ ...editingUser, [e.target.name]: e.target.value });
  };

  // Handle edit submit
  const handleEditSubmit = async (e) => {
  e.preventDefault();
  try {
    // Kiểm tra xem email đã tồn tại chưa
    const emailExists = await checkEmailExists(editingUser.email);

    if (emailExists && emailExists.id !== editingUser.id) {
      // Nếu email đã tồn tại và không phải của chính người đang sửa
      window.alert("❌ Email đã tồn tại!");
      return;
    }

    // Gửi request cập nhật
    await axios.put(`http://localhost:8080/api/users/${editingUser.id}`, editingUser);
    setEditingUser(null);
    fetchUsers();
    window.alert('✅ Cập nhật người dùng thành công!');
  } catch (err) {
    console.error('Error updating user:', err);
  }
};


  // Handle delete user
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:8080/api/users/${id}`);
        fetchUsers();
        window.alert('✅ Xóa người dùng thành công!');
      } catch (err) {
        console.error('Failed to delete user:', err);
      }
    }
  };
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Staff Management</h1>

      {/* Button to show add form */}
      <button style={styles.button} onClick={() => setAddingNewUser(!addingNewUser)}>
        {addingNewUser ? 'Cancel Add New User' : 'Add New User'}
      </button>

      {/* Add New User Form */}
      {addingNewUser && (
        <form onSubmit={handleAddSubmit} style={styles.form}>
          <input
            style={styles.input}
            name="userName"
            value={addForm.userName}
            onChange={handleAddFormChange}
            placeholder="Username"
            required
          />
          <input
            style={styles.input}
            type="password"
            name="password"
            value={addForm.password}
            onChange={handleAddFormChange}
            placeholder="Password"
            required
          />
          <input
            style={styles.input}
            name="email"
            type="email"
            value={addForm.email}
            onChange={handleAddFormChange}
            placeholder="Email"
            required
          />
          <input
            style={styles.input}
            name="phone"
            value={addForm.phone}
            onChange={handleAddFormChange}
            placeholder="Phone"
            required
          />
          <input
            style={styles.input}
            name="role"
            value={addForm.role}
            onChange={handleAddFormChange}
            placeholder="Role (admin, trainer...)"
            required
          />
          <input
            style={styles.input}
            name="createdAt"
            type="datetime-local"
            value={addForm.createdAt}
            onChange={handleAddFormChange}
            placeholder="Created At"
            required
          />
          <input
            style={styles.input}
            name="fullname"
            value={addForm.fullname}
            onChange={handleAddFormChange}
            placeholder="Full Name"
            required
          />
          <input
            style={styles.input}
            name="address"
            value={addForm.address}
            onChange={handleAddFormChange}
            placeholder="Address"
            required
          />
          <input
            style={styles.input}
            name="dateOfBirth"
            type="date"
            value={addForm.dateOfBirth}
            onChange={handleAddFormChange}
            placeholder="Date of Birth"
            required
          />
          <button
            type="submit"
            style={{ ...styles.button, gridColumn: 'span 2', backgroundColor: '#10b981' }} // green
          >
            Add User
          </button>
        </form>
      )}

      {/* Edit User Form */}
      {editingUser && (
        <>
          <h2>Edit User</h2>
          <form onSubmit={handleEditSubmit} style={styles.form}>
            <input
              style={styles.input}
              name="userName"
              value={editingUser.userName || ''}
              onChange={handleEditChange}
              placeholder="Username"
              required
              disabled
            />
            <input
              style={styles.input}
              type="password"
              name="password"
              value={editingUser.password || ''}
              onChange={handleEditChange}
              placeholder="Password"
            />
            <input
              style={styles.input}
              name="email"
              type="email"
              value={editingUser.email || ''}
              onChange={handleEditChange}
              placeholder="Email"
              required
            />
            <input
              style={styles.input}
              name="phone"
              value={editingUser.phone || ''}
              onChange={handleEditChange}
              placeholder="Phone"
              required
            />
            <input
              style={styles.input}
              name="role"
              value={editingUser.role || ''}
              onChange={handleEditChange}
              placeholder="Role (admin, trainer...)"
              required
            />
            <input
              style={styles.input}
              name="createdAt"
              type="datetime-local"
              value={editingUser.createdAt ? new Date(editingUser.createdAt).toISOString().slice(0, 16) : ''}
              onChange={handleEditChange}
              placeholder="Created At"
              required
              disabled
            />
            <input
              style={styles.input}
              name="fullname"
              value={editingUser.fullname || ''}
              onChange={handleEditChange}
              placeholder="Full Name"
              required
            />
            <input
              style={styles.input}
              name="address"
              value={editingUser.address || ''}
              onChange={handleEditChange}
              placeholder="Address"
              required
            />
            <input
              style={styles.input}
              name="dateOfBirth"
              type="date"
              value={editingUser.dateOfBirth || ''}
              onChange={handleEditChange}
              placeholder="Date of Birth"
              required
            />
            <button
              type="submit"
              style={{ ...styles.button, gridColumn: 'span 2', backgroundColor: '#f59e0b' }} // yellow
            >
              Update User
            </button>
            <button
              type="button"
              onClick={() => setEditingUser(null)}
              style={{ ...styles.button, gridColumn: 'span 2', backgroundColor: '#6b7280', marginTop: '10px' }} // gray
            >
              Cancel
            </button>
          </form>
        </>
      )}

      {/* User List */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Full Name</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Phone</th>
            <th style={styles.th}>Role</th>
            <th style={styles.th}>Full Name</th>
            <th style={styles.th}>Address</th>
            <th style={styles.th}>Date of Birth</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td style={styles.td}>{u.fullname}</td>
              <td style={styles.td}>{u.email}</td>
              <td style={styles.td}>{u.phone}</td>
              <td style={styles.td}>{u.role}</td>
              <td style={styles.td}>{u.fullname}</td>
              <td style={styles.td}>{u.address}</td>
              <td style={styles.td}>{u.dateOfBirth}</td>
              <td style={styles.actionButtons}>
                <button style={styles.editButton} onClick={() => setEditingUser(u)}>Edit</button>
                <button style={styles.deleteButton} onClick={() => handleDelete(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffManagement;
