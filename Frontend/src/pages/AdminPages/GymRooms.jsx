import React, { useState, useEffect } from "react";
import axios from "axios";
import "./GymRooms.css";

const emptyRoom = { roomName: "", roomType: "", status: "" };

export default function GymRooms() {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState(emptyRoom);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/rooms");
      setRooms(res.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const isRoomNameDuplicate = (name) => {
    return rooms.some(
      (room) => room.roomName.toLowerCase() === name.toLowerCase() && room.roomId !== editingId
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRoomNameDuplicate(form.roomName)) {
      window.alert("Room name already exists. Please choose a different name.");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`http://localhost:8080/api/admin/rooms/${editingId}`, form);
        window.alert("Room updated successfully!");
      } else {
        await axios.post("http://localhost:8080/api/admin/rooms", form);
        window.alert("Room created successfully!");
      }
      setForm(emptyRoom);
      setEditingId(null);
      setShowForm(false);
      fetchRooms();
    } catch (error) {
      console.error("Error saving room:", error);
      window.alert("An error occurred while saving the room.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await axios.delete(`http://localhost:8080/api/admin/rooms/${id}`);
        window.alert("Room deleted successfully!");
        fetchRooms();
      } catch (error) {
        console.error("Error deleting room:", error);
        window.alert("An error occurred while deleting the room.");
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setForm(emptyRoom);
    setEditingId(null);
  };

  return (
    <div className="gym-rooms-container">
      <div className="gym-rooms-header">
        <h1 className="gym-rooms-title">Gym Rooms Management</h1>
        <button
          className="btn btn-primary add-room-btn"
          onClick={() => {
            setForm(emptyRoom);
            setEditingId(null);
            setShowForm(true);
          }}
        >
          <span className="btn-icon">➕</span>
          Add New Room
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <div className="form-header">
            <h2>{editingId ? "Edit Room" : "Create New Room"}</h2>
          </div>
          <form onSubmit={handleSubmit} className="room-form">
            <div className="form-group">
              <label htmlFor="roomName">Room Name</label>
              <input
                id="roomName"
                name="roomName"
                type="text"
                value={form.roomName}
                onChange={(e) => setForm({ ...form, roomName: e.target.value })}
                placeholder="Enter room name"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="roomType">Room Type</label>
              <input
                id="roomType"
                name="roomType"
                type="text"
                value={form.roomType}
                onChange={(e) => setForm({ ...form, roomType: e.target.value })}
                placeholder="Enter room type (e.g., Cardio, Weights, Yoga)"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                required
                className="form-select"
              >
                <option value="" disabled>-- Select Status --</option>
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-success">
                {editingId ? "Save Changes" : "Create Room"}
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

      <div className="table-container">
        <table className="rooms-table">
          <thead>
            <tr>
              <th>Room Name</th>
              <th>Room Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-data">
                  No rooms available. Click "Add New Room" to get started.
                </td>
              </tr>
            ) : (
              rooms.map((room) => (
                <tr key={room.roomId}>
                  <td className="room-name">{room.roomName}</td>
                  <td className="room-type">{room.roomType}</td>
                  <td className={`room-status status-${room.status.toLowerCase()}`}>
                    <span className="status-badge">{room.status}</span>
                  </td>
                  <td className="room-actions">
                    <button
                      className="btn btn-edit"
                      onClick={() => {
                        setForm(room);
                        setEditingId(room.roomId);
                        setShowForm(true);
                      }}
                      title="Edit room"
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(room.roomId)}
                      title="Delete room"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}