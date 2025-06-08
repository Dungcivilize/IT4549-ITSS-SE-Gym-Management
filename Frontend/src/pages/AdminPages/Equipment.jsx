import React, { useState, useEffect } from "react";
import { FaExclamationTriangle, FaCheckCircle, FaFilter, FaPlus, FaCog } from "react-icons/fa";
import "./Equipment.css";

const initialFormState = {
  equipmentName: "",
  quantity: "",
  manufacturer: "",
  price: "",
  status: "",
  notes: "",
  roomId: "",
};

const statusColors = {
  Unavailable: "#ef4444",
  Available: "#10b981",
  Maintenance: "#fbbf24",
  Repair: "#f97316",
  Lost: "#6b7280",
};

const Equipment = () => {
  const [equipments, setEquipments] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [form, setForm] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filterUnavailable, setFilterUnavailable] = useState(false);

  const API_BASE = "http://localhost:8080/api/equipments";
  const ROOMS_API = "http://localhost:8080/api/admin/rooms";

  const fetchEquipments = () => {
    fetch(API_BASE)
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi khi lấy thiết bị");
        return res.json();
      })
      .then((data) => setEquipments(data))
      .catch((err) => alert(err.message));
  };

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
      setForm({
        ...eq,
        status: eq.status === "Unavailable" ? "Maintenance" : eq.status,
      });
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

  let filteredEquipments =
    selectedRoomId === ""
      ? equipments
      : equipments.filter((eq) => eq.roomId.toString() === selectedRoomId);

  if (filterUnavailable) {
    filteredEquipments = filteredEquipments.filter(
      (eq) => eq.status === "Unavailable"
    );
  }

  const hasUnavailable = equipments.some((eq) => eq.status === "Unavailable");

  return (
    <div className="equipment-container">
      <div className="equipment-header">
        <h1 className="equipment-title">
          <FaCog className="title-icon" />
          Equipment Management
        </h1>
      </div>

      {/* Filter Controls */}
      <div className="filter-controls">
        <div className="filter-section">
          <button
            onClick={() => setFilterUnavailable(!filterUnavailable)}
            disabled={!hasUnavailable}
            className={`filter-btn ${filterUnavailable ? 'active' : ''} ${!hasUnavailable ? 'disabled' : ''}`}
          >
            <FaFilter className="btn-icon" />
            {filterUnavailable ? "Bỏ lọc máy lỗi" : "Lọc máy lỗi"}
          </button>

          <div className="status-indicator">
            {hasUnavailable ? (
              <div className="status-warning">
                <FaExclamationTriangle className="status-icon" />
                <span>Có máy hỏng cần bảo trì</span>
              </div>
            ) : (
              <div className="status-success">
                <FaCheckCircle className="status-icon" />
                <span>Máy móc vẫn ổn</span>
              </div>
            )}
          </div>
        </div>

        <select
          className="room-select"
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
      </div>

      {/* Add Equipment Button */}
      {!showForm && (
        <button 
          className="btn btn-primary add-equipment-btn"
          onClick={() => setShowForm(true)}
        >
          <FaPlus className="btn-icon" />
          Add New Equipment
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div className="form-container">
          <div className="form-header">
            <h2>{editingId !== null ? "Edit Equipment" : "Add New Equipment"}</h2>
          </div>
          <form onSubmit={handleSubmit} className="equipment-form">
            <div className="form-group">
              <label htmlFor="equipmentName">Equipment Name</label>
              <input
                id="equipmentName"
                type="text"
                placeholder="Enter equipment name"
                name="equipmentName"
                value={form.equipmentName}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input
                id="quantity"
                type="number"
                placeholder="Enter quantity"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                required
                min={1}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="manufacturer">Manufacturer</label>
              <input
                id="manufacturer"
                type="text"
                placeholder="Enter manufacturer"
                name="manufacturer"
                value={form.manufacturer}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                id="price"
                type="number"
                placeholder="Enter price"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                min={0}
                step="0.01"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="">-- Select Status --</option>
                {Object.keys(statusColors).map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="roomId">Room</label>
              <select
                id="roomId"
                name="roomId"
                value={form.roomId}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="">-- Select Room --</option>
                {rooms.map((room) => (
                  <option key={room.roomId} value={room.roomId}>
                    {room.roomName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group form-group-full">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                placeholder="Enter additional notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                className="form-textarea"
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-success">
                {editingId !== null ? "Update Equipment" : "Add Equipment"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-cancel"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="table-container">
        <table className="equipment-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Manufacturer</th>
              <th>Price</th>
              <th>Status</th>
              <th>Notes</th>
              <th>Room</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEquipments.length > 0 ? (
              filteredEquipments.map((eq) => (
                <tr key={eq.equipmentId}>
                  <td className="equipment-id">{eq.equipmentId}</td>
                  <td className="equipment-name">{eq.equipmentName}</td>
                  <td className="equipment-quantity">{eq.quantity}</td>
                  <td className="equipment-manufacturer">{eq.manufacturer}</td>
                  <td className="equipment-price">${eq.price.toLocaleString()}</td>
                  <td className="equipment-status">
                    <span 
                      className={`status-badge status-${eq.status.toLowerCase()}`}
                    >
                      {eq.status}
                    </span>
                  </td>
                  <td className="equipment-notes">{eq.notes || "-"}</td>
                  <td className="equipment-room">
                    {rooms.find((r) => r.roomId === eq.roomId)?.roomName || "-"}
                  </td>
                  <td className="equipment-actions">
                    <button
                      className="btn btn-edit"
                      onClick={() => handleEdit(eq.equipmentId)}
                      title="Edit equipment"
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(eq.equipmentId)}
                      title="Delete equipment"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-data">
                  No equipment found. Click "Add New Equipment" to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Equipment;