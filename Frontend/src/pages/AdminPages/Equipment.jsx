import React, { useState, useEffect } from "react";

const styles = {
  container: { maxWidth: "900px", margin: "0 auto", padding: "20px" },
  title: {
    textAlign: "center",
    color: "#1e40af",
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "30px",
  },
  button: {
    padding: "10px 15px",
    marginBottom: "20px",
    cursor: "pointer",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#3b82f6",
    color: "#fff",
  },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(1, 1fr)",
    gap: "15px",
    marginBottom: "40px",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    width: "100%",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.9rem",
    border: "1px solid #ccc",
  },
  th: {
    border: "1px solid #ddd",
    padding: "10px",
    backgroundColor: "#f3f4f6",
    textAlign: "center",
  },
  td: { border: "1px solid #ddd", padding: "8px", textAlign: "center" },
  actionButtons: { display: "flex", gap: "8px", justifyContent: "center" },
  editButton: {
    backgroundColor: "#fbbf24",
    border: "none",
    borderRadius: "4px",
    padding: "6px 12px",
    color: "white",
    cursor: "pointer",
  },
  deleteButton: {
    backgroundColor: "#ef4444",
    border: "none",
    borderRadius: "4px",
    padding: "6px 12px",
    color: "white",
    cursor: "pointer",
  },
  cancelButton: {
    backgroundColor: "#9ca3af",
    border: "none",
    borderRadius: "4px",
    padding: "6px 12px",
    color: "white",
    cursor: "pointer",
  },
  submitButton: {
    backgroundColor: "#10b981",
    border: "none",
    borderRadius: "4px",
    padding: "6px 12px",
    color: "white",
    cursor: "pointer",
  },
  selectRoom: {
    width: "200px",
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "20px",
  },
};

const initialFormState = {
  equipmentName: "",
  quantity: "",
  manufacturer: "",
  price: "",
  status: "",
  notes: "",
  roomId: "",
};

const Equipment = () => {
  const [equipments, setEquipments] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(""); // "" = tất cả phòng
  const [form, setForm] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const API_BASE = "http://localhost:8080/api/equipments";
  const ROOMS_API = "http://localhost:8080/api/admin/rooms";

  // Lấy danh sách thiết bị
  const fetchEquipments = () => {
    fetch(API_BASE)
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi khi lấy thiết bị");
        return res.json();
      })
      .then((data) => setEquipments(data))
      .catch((err) => alert(err.message));
  };

  // Lấy danh sách phòng
  const fetchRooms = () => {
    fetch(ROOMS_API)
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi khi lấy phòng");
        return res.json();
      })
      .then((data) => setRooms(data))
      .catch((err) => alert(err.message));
  };

  useEffect(() => {
    fetchEquipments();
    fetchRooms();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const method = editingId !== null ? "PUT" : "POST";
    const url = editingId !== null ? `${API_BASE}/${editingId}` : API_BASE;

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi khi lưu thiết bị");
        return res.json();
      })
      .then(() => {
        fetchEquipments();
        setForm(initialFormState);
        setEditingId(null);
        setShowForm(false);
      })
      .catch((err) => alert(err.message));
  };

  const handleEdit = (id) => {
    const eq = equipments.find((e) => e.equipmentId === id);
    if (eq) {
      setForm(eq);
      setEditingId(id);
      setShowForm(true);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa thiết bị này không?")) {
      fetch(`${API_BASE}/${id}`, { method: "DELETE" })
        .then((res) => {
          if (!res.ok) throw new Error("Lỗi khi xóa thiết bị");
          fetchEquipments();
          if (editingId === id) {
            setEditingId(null);
            setForm(initialFormState);
            setShowForm(false);
          }
        })
        .catch((err) => alert(err.message));
    }
  };

  const handleCancel = () => {
    setForm(initialFormState);
    setEditingId(null);
    setShowForm(false);
  };

  const handleRoomChange = (e) => {
    setSelectedRoomId(e.target.value);
  };

  // Lọc thiết bị theo phòng nếu chọn phòng
  const filteredEquipments =
    selectedRoomId === ""
      ? equipments
      : equipments.filter((eq) => eq.roomId.toString() === selectedRoomId);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Equipment Management</h1>

      {/* Dropdown select room */}
      <select
        style={styles.selectRoom}
        value={selectedRoomId}
        onChange={handleRoomChange}
      >
        <option value="">-- All Rooms --</option>
        {rooms.map((room) => (
          <option key={room.roomId} value={room.roomId}>
            {room.roomName}
          </option>
        ))}
      </select>

      {!showForm && (
        <button style={styles.button} onClick={() => setShowForm(true)}>
          Add New Equipment
        </button>
      )}

      {showForm && (
        <form style={styles.form} onSubmit={handleSubmit}>
          <input
            style={styles.input}
            name="equipmentName"
            placeholder="Equipment Name"
            value={form.equipmentName}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            name="quantity"
            type="number"
            placeholder="Quantity"
            value={form.quantity}
            onChange={handleChange}
            required
            min={1}
          />
          <input
            style={styles.input}
            name="manufacturer"
            placeholder="Manufacturer"
            value={form.manufacturer}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
            min={0}
            step="0.01"
          />
          <input
            style={styles.input}
            name="status"
            placeholder="Status"
            value={form.status}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            name="notes"
            placeholder="Notes"
            value={form.notes}
            onChange={handleChange}
          />
          <select
            style={styles.input}
            name="roomId"
            value={form.roomId}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Room --</option>
            {rooms.map((room) => (
              <option key={room.roomId} value={room.roomId}>
                {room.roomName}
              </option>
            ))}
          </select>

          <div>
            <button type="submit" style={styles.submitButton}>
              {editingId !== null ? "Save" : "Add"}
            </button>
            <button
              type="button"
              style={styles.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Equipment Name</th>
            <th style={styles.th}>Quantity</th>
            <th style={styles.th}>Manufacturer</th>
            <th style={styles.th}>Price</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Notes</th>
            <th style={styles.th}>Room</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEquipments.length > 0 ? (
            filteredEquipments.map((eq) => (
              <tr key={eq.equipmentId}>
                <td style={styles.td}>{eq.equipmentName}</td>
                <td style={styles.td}>{eq.quantity}</td>
                <td style={styles.td}>{eq.manufacturer}</td>
                <td style={styles.td}>{eq.price}</td>
                <td style={styles.td}>{eq.status}</td>
                <td style={styles.td}>{eq.notes}</td>
                <td style={styles.td}>
                  {rooms.find((r) => r.roomId === eq.roomId)?.roomName || "Unknown"}
                </td>
                <td style={styles.td}>
                  <div style={styles.actionButtons}>
                    <button
                      style={styles.editButton}
                      onClick={() => handleEdit(eq.equipmentId)}
                    >
                      Edit
                    </button>
                    <button
                      style={styles.deleteButton}
                      onClick={() => handleDelete(eq.equipmentId)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={styles.td}>
                No equipment found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Equipment;