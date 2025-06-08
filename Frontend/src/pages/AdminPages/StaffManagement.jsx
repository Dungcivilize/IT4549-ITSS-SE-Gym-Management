import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StaffManagement.css';

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
    <div className="staff-management">
      <div className="staff-container">
        <h1 className="staff-title">Staff Management</h1>

        {/* Button to show add form */}
        <button className="staff-button" onClick={() => setAddingNewUser(!addingNewUser)}>
          {addingNewUser ? 'Cancel Add New User' : 'Add New User'}
        </button>

        {/* Add New User Form */}
        {addingNewUser && (
          <form onSubmit={handleAddSubmit} className="staff-form">
            <input
              className="staff-input"
              name="userName"
              value={addForm.userName}
              onChange={handleAddFormChange}
              placeholder="Username"
              required
            />
            <input
              className="staff-input"
              type="password"
              name="password"
              value={addForm.password}
              onChange={handleAddFormChange}
              placeholder="Password"
              required
            />
            <input
              className="staff-input"
              name="email"
              type="email"
              value={addForm.email}
              onChange={handleAddFormChange}
              placeholder="Email"
              required
            />
            <input
              className="staff-input"
              name="phone"
              value={addForm.phone}
              onChange={handleAddFormChange}
              placeholder="Phone"
              required
            />
            <select
              className="staff-select"
              name="role"
              value={addForm.role}
              onChange={handleAddFormChange}
              required
            >
              <option value="">-- Select Role --</option>
              <option value="member">Member</option>
              <option value="trainer">Trainer</option>
              <option value="receptionist">Receptionist</option>
              <option value="admin">Admin</option>
            </select>
            <input
              className="staff-input"
              name="createdAt"
              type="datetime-local"
              value={addForm.createdAt}
              onChange={handleAddFormChange}
              placeholder="Created At"
              required
            />
            <input
              className="staff-input"
              name="fullname"
              value={addForm.fullname}
              onChange={handleAddFormChange}
              placeholder="Full Name"
              required
            />
            <input
              className="staff-input"
              name="address"
              value={addForm.address}
              onChange={handleAddFormChange}
              placeholder="Address"
              required
            />
            <input
              className="staff-input"
              name="dateOfBirth"
              type="date"
              value={addForm.dateOfBirth}
              onChange={handleAddFormChange}
              placeholder="Date of Birth"
              required
            />
            <button
              type="submit"
              className="staff-submit-button staff-submit-success"
            >
              Add User
            </button>
          </form>
        )}

        {/* Edit User Form */}
        {editingUser && (
          <>
            <h2 className="staff-section-header">Edit User</h2>
            <form onSubmit={handleEditSubmit} className="staff-form">
              <input
                className="staff-input"
                name="userName"
                value={editingUser.userName || ''}
                onChange={handleEditChange}
                placeholder="Username"
                required
                disabled
              />
              <input
                className="staff-input"
                type="password"
                name="password"
                value={editingUser.password || ''}
                onChange={handleEditChange}
                placeholder="Password"
              />
              <input
                className="staff-input"
                name="email"
                type="email"
                value={editingUser.email || ''}
                onChange={handleEditChange}
                placeholder="Email"
                required
              />
              <input
                className="staff-input"
                name="phone"
                value={editingUser.phone || ''}
                onChange={handleEditChange}
                placeholder="Phone"
                required
              />
              <select
                className="staff-select"
                name="role"
                value={editingUser.role || ''}
                onChange={handleEditChange}
                required
              >
                <option value="">-- Select Role --</option>
                <option value="member">Member</option>
                <option value="trainer">Trainer</option>
                <option value="receptionist">Receptionist</option>
                <option value="admin">Admin</option>
              </select>
              <input
                className="staff-input"
                name="createdAt"
                type="datetime-local"
                value={editingUser.createdAt ? new Date(editingUser.createdAt).toISOString().slice(0, 16) : ''}
                onChange={handleEditChange}
                placeholder="Created At"
                required
                disabled
              />
              <input
                className="staff-input"
                name="fullname"
                value={editingUser.fullname || ''}
                onChange={handleEditChange}
                placeholder="Full Name"
                required
              />
              <input
                className="staff-input"
                name="address"
                value={editingUser.address || ''}
                onChange={handleEditChange}
                placeholder="Address"
                required
              />
              <input
                className="staff-input"
                name="dateOfBirth"
                type="date"
                value={editingUser.dateOfBirth || ''}
                onChange={handleEditChange}
                placeholder="Date of Birth"
                required
              />
              <button
                type="submit"
                className="staff-submit-button staff-submit-warning"
              >
                Update User
              </button>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="staff-submit-button staff-submit-neutral"
              >
                Cancel
              </button>
            </form>
          </>
        )}

        {/* User List */}
        <table className="staff-table">
          <thead className="staff-table-header">
            <tr>
              <th className="staff-th">Email</th>
              <th className="staff-th">Phone</th>
              <th className="staff-th">Role</th>
              <th className="staff-th">Full Name</th>
              <th className="staff-th">Address</th>
              <th className="staff-th">Date of Birth</th>
              <th className="staff-th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="staff-td">{u.email}</td>
                <td className="staff-td">{u.phone}</td>
                <td className="staff-td">{u.role}</td>
                <td className="staff-td">{u.fullname}</td>
                <td className="staff-td">{u.address}</td>
                <td className="staff-td">{u.dateOfBirth}</td>
                <td className="staff-td">
                  <div className="staff-action-buttons">
                    <button
                      className="staff-action-button staff-edit-button"
                      onClick={() => setEditingUser(u)}
                    >
                      Edit
                    </button>
                    <button
                      className="staff-action-button staff-delete-button"
                      onClick={() => handleDelete(u.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffManagement;