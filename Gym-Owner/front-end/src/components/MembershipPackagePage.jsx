import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:8080/api/packages";

export default function MembershipPackagePage() {
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    duration: "",
    price: "",
    type: ""
  });

  // Load data
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setPackages(data))
      .catch(err => console.error("Lỗi khi tải gói:", err));
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const method = form.id ? "PUT" : "POST";
    const url = form.id ? `${API_URL}/${form.id}` : API_URL;

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(res => res.json())
      .then(() => {
        setForm({ id: null, name: "", duration: "", price: "", type: "" });
        fetchPackages();
      });
  };

  const handleEdit = pkg => {
    setForm(pkg);
  };

  const handleDelete = id => {
    if (!window.confirm("Bạn có chắc muốn xoá gói tập này?")) return;

    fetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then(() => fetchPackages());
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>🎯 Thiết lập Gói tập</h2>

      <div style={{ marginBottom: 20 }}>
        <input
          name="name"
          placeholder="Tên gói"
          value={form.name}
          onChange={handleChange}
          style={{ marginRight: 10 }}
        />
        <input
          name="duration"
          placeholder="Thời hạn (tháng)"
          value={form.duration}
          onChange={handleChange}
          style={{ marginRight: 10 }}
        />
        <input
          name="price"
          placeholder="Giá (VNĐ)"
          value={form.price}
          onChange={handleChange}
          style={{ marginRight: 10 }}
        />
        <input
          name="type"
          placeholder="Loại gói (ví dụ: Basic, Premium)"
          value={form.type}
          onChange={handleChange}
          style={{ marginRight: 10 }}
        />
        <button onClick={handleSubmit}>
          {form.id ? "Cập nhật" : "Thêm mới"}
        </button>
      </div>

      <h3>📋 Danh sách gói tập</h3>
      <div style={{ maxHeight: 500, overflowY: "auto" }}>
        <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#f0f0f0" }}>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Thời hạn</th>
              <th>Giá</th>
              <th>Loại</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {packages.length > 0 ? (
              packages.map(pkg => (
                <tr key={pkg.id}>
                  <td>{pkg.id}</td>
                  <td>{pkg.name}</td>
                  <td>{pkg.duration} tháng</td>
                  <td>{pkg.price.toLocaleString()} VNĐ</td>
                  <td>{pkg.type}</td>
                  <td>
                    <button onClick={() => handleEdit(pkg)}>Sửa</button>
                    <button onClick={() => handleDelete(pkg.id)} style={{ marginLeft: 10 }}>
                      Xoá
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  Không có gói tập nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
