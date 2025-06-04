import React, { useState, useEffect } from "react";
import axios from "axios";

const emptyRoom = { roomName: "", roomType: "", status: "" };

const styles = {
  container: { maxWidth: '900px', margin: '0 auto', padding: '20px' },
  title: { textAlign: 'center', color: '#1e40af', fontSize: '2rem', fontWeight: 'bold', marginBottom: '30px' },
  button: { padding: '10px 15px', marginBottom: '20px', cursor: 'pointer', borderRadius: '5px', border: 'none', backgroundColor: '#3b82f6', color: '#fff' },
  form: { display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '15px', marginBottom: '40px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' },
  input: { padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1rem', width: '100%' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', border: '1px solid #ccc' },
  th: { border: '1px solid #ddd', padding: '10px', backgroundColor: '#f3f4f6', textAlign: 'center' },
  td: { border: '1px solid #ddd', padding: '8px', textAlign: 'center' },
  actionButtons: { display: 'flex', gap: '8px', justifyContent: 'center' },
  editButton: { backgroundColor: '#fbbf24', border: 'none', borderRadius: '4px', padding: '6px 12px', color: 'white', cursor: 'pointer' },
  deleteButton: { backgroundColor: '#ef4444', border: 'none', borderRadius: '4px', padding: '6px 12px', color: 'white', cursor: 'pointer' },
  cancelButton: { backgroundColor: '#9ca3af', border: 'none', borderRadius: '4px', padding: '6px 12px', color: 'white', cursor: 'pointer' },
  submitButton: { backgroundColor: '#10b981', border: 'none', borderRadius: '4px', padding: '6px 12px', color: 'white', cursor: 'pointer' },
};

export default function GymRooms() {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState(emptyRoom);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const res = await axios.get("http://localhost:8080/api/rooms");
    setRooms(res.data);
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
        await axios.put(`http://localhost:8080/api/rooms/${editingId}`, form);
        window.alert("Room updated successfully!");
      } else {
        await axios.post("http://localhost:8080/api/rooms", form);
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
        await axios.delete(`http://localhost:8080/api/rooms/${id}`);
        window.alert("Room deleted successfully!");
        fetchRooms();
      } catch (error) {
        console.error("Error deleting room:", error);
        window.alert("An error occurred while deleting the room.");
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Gym Rooms</h1>

      <button
        style={styles.button}
        onClick={() => {
          setForm(emptyRoom);
          setEditingId(null);
          setShowForm(true);
        }}
      >
        ➕ Add Room
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="roomName"
            value={form.roomName}
            onChange={(e) => setForm({ ...form, roomName: e.target.value })}
            placeholder="Room Name"
            required
            style={styles.input}
          />
          <input
            name="roomType"
            value={form.roomType}
            onChange={(e) => setForm({ ...form, roomType: e.target.value })}
            placeholder="Room Type"
            required
            style={styles.input}
          />
          <input
            name="status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            placeholder="Status"
            required
            style={styles.input}
          />
          <div style={styles.actionButtons}>
            <button type="submit" style={styles.submitButton}>
              {editingId ? "Save Changes" : "Create Room"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setForm(emptyRoom);
                setEditingId(null);
                window.alert("Operation cancelled.");
              }}
              style={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Type</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.roomId}>
              <td style={styles.td}>{room.roomName}</td>
              <td style={styles.td}>{room.roomType}</td>
              <td style={styles.td}>{room.status}</td>
              <td style={styles.td}>
                <div style={styles.actionButtons}>
                  <button
                    style={styles.editButton}
                    onClick={() => {
                      setForm(room);
                      setEditingId(room.roomId);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    style={styles.deleteButton}
                    onClick={() => handleDelete(room.roomId)}
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
  );
}
