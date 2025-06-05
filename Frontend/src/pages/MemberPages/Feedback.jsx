import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../assets/css/MemberHomePage.module.css";
import MemberNavbar from "../../Components/MemberNavbar";

const Feedback = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const user_id = user.user_id;
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackText, setFeedbackText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMyFeedbacks, setShowMyFeedbacks] = useState(false);
  const [myFeedbacks, setMyFeedbacks] = useState([]);

  // Lấy danh sách phòng
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/member/rooms");
        setRooms(res.data);
        if (res.data.length > 0) {
          setSelectedRoom(res.data[0].roomId);
        }
      } catch (err) {
        setError("Không lấy được danh sách phòng");
      }
    };
    fetchRooms();
  }, []);

  // Lấy feedbacks của phòng được chọn
  useEffect(() => {
    const fetchFeedbacks = async () => {
      if (!selectedRoom) return;
      try {
        const res = await axios.get(`http://localhost:8080/api/feedbacks/room/${selectedRoom}`);
        setFeedbacks(res.data);
      } catch (err) {
        setError("Không lấy được danh sách feedback");
      }
    };
    fetchFeedbacks();
  }, [selectedRoom, success]);

  // Lấy feedback của user
  const fetchMyFeedbacks = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/feedbacks/member/${user_id}`);
      setMyFeedbacks(res.data);
    } catch (err) {
      setError("Không lấy được danh sách feedback của bạn");
    }
  };

  // Gửi feedback mới
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!feedbackText.trim()) {
      setError("Nội dung feedback không được để trống");
      return;
    }
    setLoading(true);
    try {
      await axios.post("http://localhost:8080/api/feedbacks", {
        memberId: user_id,
        roomId: selectedRoom,
        feedbackText
      });
      setSuccess("Gửi feedback thành công!");
      setFeedbackText("");
      setShowAddModal(false);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Bắt đầu chỉnh sửa feedback
  const handleEdit = (fb) => {
    setEditingId(fb.feedbackId);
    setEditingText(fb.feedbackText);
  };

  // Lưu chỉnh sửa feedback
  const handleSaveEdit = async (feedbackId) => {
    setError("");
    setSuccess("");
    if (!editingText.trim()) {
      setError("Nội dung feedback không được để trống");
      return;
    }
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:8080/api/feedbacks/${feedbackId}/member/${user_id}`,
        {
          memberId: user_id,
          feedbackText: editingText
        }
      );
      setSuccess("Cập nhật feedback thành công!");
      setEditingId(null);
      setEditingText("");
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Hủy chỉnh sửa feedback
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  // Xóa feedback
  const handleDelete = async (feedbackId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa feedback này?")) return;
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await axios.delete(
        `http://localhost:8080/api/feedbacks/${feedbackId}/member/${user_id}`
      );
      setSuccess("Xóa feedback thành công!");
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper} style={{ minHeight: "100vh", padding: "2rem" }}>
      <MemberNavbar />
      <div className={styles.profileBox}>
        <h2 style={{ color: "#f9ac54", textAlign: "center" }}>Góp ý - Feedback</h2>
        {success && <div style={{ color: "green", textAlign: "center" }}>{success}</div>}
        {error && <div style={{ color: "red", textAlign: "center" }}>{error}</div>}
        
        {/* Chọn phòng */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ color: "#fff", marginRight: "1rem" }}>Chọn phòng:</label>
          <select 
            value={selectedRoom || ""} 
            onChange={(e) => setSelectedRoom(Number(e.target.value))}
            style={{ padding: "0.5rem", borderRadius: "4px" }}
          >
            {rooms.map(room => (
              <option key={room.roomId} value={room.roomId}>
                {room.roomName}
              </option>
            ))}
          </select>
        </div>

        {/* Nút thêm feedback và danh sách feedback đã gửi */}
        <div style={{ textAlign: "center", marginBottom: "1rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
          <button 
            className={styles.btn}
            onClick={() => setShowAddModal(true)}
          >
            Thêm feedback mới
          </button>
          <button
            className={styles.btn}
            style={{ background: "#2196f3" }}
            onClick={() => {
              fetchMyFeedbacks();
              setShowMyFeedbacks(true);
            }}
          >
            Danh sách feedback đã gửi
          </button>
        </div>

        {/* Modal danh sách feedback đã gửi */}
        {showMyFeedbacks && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}>
            <div style={{
              background: "#333",
              padding: "2rem",
              borderRadius: "8px",
              width: "80%",
              maxWidth: "600px",
              maxHeight: "80vh",
              overflowY: "auto"
            }}>
              <h3 style={{ color: "#f9ac54", marginBottom: "1rem", textAlign: "center" }}>Feedback bạn đã gửi</h3>
              <button
                className={styles.btn}
                style={{ background: "#888", marginBottom: "1rem" }}
                onClick={() => setShowMyFeedbacks(false)}
              >
                Đóng
              </button>
              {myFeedbacks.length === 0 ? (
                <div style={{ color: "#fff", textAlign: "center" }}>Bạn chưa gửi feedback nào.</div>
              ) : (
                myFeedbacks.map(fb => (
                  <div key={fb.feedbackId} style={{
                    background: "#222",
                    borderRadius: 8,
                    padding: "1rem",
                    marginBottom: 12,
                    color: "#fff",
                    position: "relative"
                  }}>
                    <div style={{ marginBottom: 4 }}>
                      <b>Phòng:</b> {fb.roomName || fb.room?.roomName || "Không rõ"}
                    </div>
                    <div style={{ marginBottom: 4 }}>
                      <b>Ngày gửi:</b> {fb.feedbackDate}
                    </div>
                    <div>
                      <b>Nội dung:</b>
                      {editingId === fb.feedbackId ? (
                        <>
                          <textarea
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            rows={2}
                            style={{ width: "100%", marginTop: 8, borderRadius: 4, padding: 4 }}
                          />
                          <div style={{ marginTop: 8 }}>
                            <button
                              style={{ marginRight: 8 }}
                              className={styles.btn}
                              onClick={() => handleSaveEdit(fb.feedbackId)}
                              disabled={loading}
                            >
                              Lưu
                            </button>
                            <button
                              className={styles.btn}
                              style={{ background: "#888" }}
                              onClick={handleCancelEdit}
                            >
                              Hủy
                            </button>
                          </div>
                        </>
                      ) : (
                        <> {fb.feedbackText}</>
                      )}
                    </div>
                    {editingId !== fb.feedbackId && (
                      <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 8 }}>
                        <button
                          style={{
                            background: "#2196f3",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                            padding: "4px 12px",
                            cursor: "pointer"
                          }}
                          onClick={() => handleEdit(fb)}
                        >
                          Sửa
                        </button>
                        <button
                          style={{
                            background: "#f44336",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                            padding: "4px 12px",
                            cursor: "pointer"
                          }}
                          onClick={() => handleDelete(fb.feedbackId)}
                        >
                          Xóa
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Modal thêm feedback */}
        {showAddModal && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}>
            <div style={{
              background: "#333",
              padding: "2rem",
              borderRadius: "8px",
              width: "80%",
              maxWidth: "500px"
            }}>
              <h3 style={{ color: "#f9ac54", marginBottom: "1rem" }}>Thêm feedback mới</h3>
              <form onSubmit={handleSubmit}>
                <textarea
                  rows={3}
                  style={{ 
                    width: "100%", 
                    marginBottom: "1rem", 
                    borderRadius: "8px", 
                    padding: "8px",
                    background: "#444",
                    color: "#fff",
                    border: "1px solid #666"
                  }}
                  placeholder="Nhập nội dung góp ý của bạn..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                />
                <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                  <button 
                    type="button"
                    className={styles.btn}
                    style={{ background: "#666" }}
                    onClick={() => setShowAddModal(false)}
                  >
                    Hủy
                  </button>
                  <button 
                    className={styles.btn}
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Đang gửi..." : "Gửi feedback"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Danh sách feedback */}
        <div style={{ marginTop: "2rem" }}>
          <h3 style={{ color: "#f9ac54", textAlign: "center" }}>Danh sách feedback</h3>
          {feedbacks.length === 0 ? (
            <div style={{ textAlign: "center", color: "#fff" }}>Chưa có feedback nào.</div>
          ) : (
            feedbacks.map((fb) => (
              <div
                key={fb.feedbackId}
                style={{
                  background: "#333",
                  borderRadius: 8,
                  padding: "1rem",
                  marginBottom: 12,
                  color: "#fff",
                  position: "relative"
                }}
              >
                <div style={{ marginBottom: 4 }}>
                  <b>Người gửi:</b> {fb.userName}
                </div>
                <div style={{ marginBottom: 4 }}>
                  <b>Ngày gửi:</b> {fb.feedbackDate}
                </div>
                <div>
                  <b>Nội dung:</b>
                  {editingId === fb.feedbackId ? (
                    <>
                      <textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        rows={2}
                        style={{ width: "100%", marginTop: 8, borderRadius: 4, padding: 4 }}
                      />
                      <div style={{ marginTop: 8 }}>
                        <button
                          style={{ marginRight: 8 }}
                          className={styles.btn}
                          onClick={() => handleSaveEdit(fb.feedbackId)}
                          disabled={loading}
                        >
                          Lưu
                        </button>
                        <button
                          className={styles.btn}
                          style={{ background: "#888" }}
                          onClick={handleCancelEdit}
                        >
                          Hủy
                        </button>
                      </div>
                    </>
                  ) : (
                    <> {fb.feedbackText}</>
                  )}
                </div>
                {editingId !== fb.feedbackId && fb.userName === user.user_name && (
                  <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 8 }}>
                    <button
                      style={{
                        background: "#2196f3",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        padding: "4px 12px",
                        cursor: "pointer"
                      }}
                      onClick={() => handleEdit(fb)}
                    >
                      Sửa
                    </button>
                    <button
                      style={{
                        background: "#f44336",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        padding: "4px 12px",
                        cursor: "pointer"
                      }}
                      onClick={() => handleDelete(fb.feedbackId)}
                    >
                      Xóa
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Feedback;