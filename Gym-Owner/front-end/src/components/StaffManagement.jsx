import React, { useEffect, useState } from "react";

function StaffManagement() {
  const [staffs, setStaffs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingStaff, setEditingStaff] = useState(null);
  const [newStaff, setNewStaff] = useState({
    userName: "",
    password: "",
    phone: "",
    email: "",
    role: "",
    fullname: "",
  });

  // Fetch all users on mount
  useEffect(() => {
    fetch("http://localhost:8080/api/users")
      .then((res) => res.json())
      .then((data) => setStaffs(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  // Filter staffs theo searchTerm
  const filteredStaffs = staffs.filter(staff => {
  const userName = staff.userName ? staff.userName.toLowerCase() : "";
  const email = staff.email ? staff.email.toLowerCase() : "";
  const role = staff.role ? staff.role.toLowerCase() : "";
  const term = searchTerm.toLowerCase();

  return userName.includes(term) || email.includes(term) || role.includes(term);
});


  // Handle change khi edit
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingStaff((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle change khi thêm mới
  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewStaff((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Lưu thông tin sửa
  const handleSave = () => {
    fetch(`http://localhost:8080/api/users/${editingStaff.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingStaff),
    })
      .then((res) => res.json())
      .then((updated) => {
        setStaffs((prev) =>
          prev.map((s) => (s.id === updated.id ? updated : s))
        );
        setEditingStaff(null);
      })
      .catch((err) => console.error("Update error:", err));
  };

  // Xóa user
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này không?")) {
      fetch(`http://localhost:8080/api/users/${id}`, {
        method: "DELETE",
      })
        .then(() => {
          setStaffs((prev) => prev.filter((s) => s.id !== id));
        })
        .catch((err) => console.error("Delete error:", err));
    }
  };

  // Thêm user mới
  const handleAdd = () => {
    const toCreate = {
      ...newStaff,
      createdAt: new Date().toISOString(),
    };

    fetch("http://localhost:8080/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toCreate),
    })
      .then((res) => res.json())
      .then((created) => {
        setStaffs((prev) => [...prev, created]);
        setNewStaff({
          userName: "",
          password: "",
          phone: "",
          email: "",
          role: "",
          fullname: "",
        });
      })
      .catch((err) => console.error("Create error:", err));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Quản lý nhân sự</h2>

      <h3>Thêm nhân sự mới</h3>
      <input
        placeholder="Họ tên"
        name="fullname"
        value={newStaff.fullname}
        onChange={handleNewChange}
      />
      <input
        placeholder="Tên đăng nhập"
        name="userName"
        value={newStaff.userName}
        onChange={handleNewChange}
      />
      <input
        placeholder="Mật khẩu"
        name="password"
        value={newStaff.password}
        onChange={handleNewChange}
      />
      <input
        placeholder="Số điện thoại"
        name="phone"
        value={newStaff.phone}
        onChange={handleNewChange}
      />
      <input
        placeholder="Email"
        name="email"
        value={newStaff.email}
        onChange={handleNewChange}
      />
      <input
        placeholder="Vai trò"
        name="role"
        value={newStaff.role}
        onChange={handleNewChange}
      />
      <button onClick={handleAdd}>Thêm</button>

      <h3>Tìm kiếm nhân sự</h3>
      <input
        type="text"
        placeholder="Tìm theo tên đăng nhập, email hoặc vai trò..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: "5px 10px", marginBottom: 15, width: "300px" }}
      />

      <h3>Danh sách nhân sự</h3>
      <div style={{ maxHeight: "490px", overflowY: "auto" }}>
      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Họ tên</th>
            <th>Tên đăng nhập</th>
            <th>Mật khẩu</th>
            <th>Điện thoại</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredStaffs.map((staff) => (
            <tr key={staff.id}>
              <td>{staff.id}</td>
              {editingStaff?.id === staff.id ? (
                <>
                  <td>
                    <input
                      name="fullname"
                      value={editingStaff.fullname}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      name="userName"
                      value={editingStaff.userName}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      name="password"
                      value={editingStaff.password}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      name="phone"
                      value={editingStaff.phone}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      name="email"
                      value={editingStaff.email}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      name="role"
                      value={editingStaff.role}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <button onClick={handleSave}>Lưu</button>
                    <button onClick={() => setEditingStaff(null)}>Hủy</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{staff.fullname}</td>
                  <td>{staff.userName}</td>
                  <td>{staff.password}</td>
                  <td>{staff.phone}</td>
                  <td>{staff.email}</td>
                  <td>{staff.role}</td>
                  <td>
                    <button onClick={() => setEditingStaff(staff)}>Sửa</button>
                    <button onClick={() => handleDelete(staff.id)}>Xóa</button>
                  </td>
                </>
              )}
            </tr>
          ))}
          {filteredStaffs.length === 0 && (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                Không tìm thấy nhân sự nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
  );
}

export default StaffManagement;
