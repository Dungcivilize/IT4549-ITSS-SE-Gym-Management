import React, { useEffect, useState } from "react";
import styles from "../../assets/css/MemberHomePage.module.css";
import MemberNavbar from "../../Components/MemberNavbar";

const Feedback = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const user_id = user.user_id;
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackText, setFeedbackText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // Lấy feedbacks của user
  useEffect(() => {
    const fetchFeedbacks = async () => {
      if (!user_id) return;
      try {
        const res = await fetch(`http://localhost:8080/api/feedbacks/member/${user_id}`);
        const data = await res.json();
        setFeedbacks(data);
      } catch (err) {
        setError("Không lấy được danh sách feedback");
      }
    };
    fetchFeedbacks();
  }, [user_id, success]);

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
      const res = await fetch("http://localhost:8080/api/feedbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId: user_id, feedbackText }),
      });
      if (!res.ok) throw new Error(await res.text());
      setSuccess("Gửi feedback thành công!");
      setFeedbackText("");
    } catch (err) {
      setError(err.message);
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
      const res = await fetch(
        `http://localhost:8080/api/feedbacks/${feedbackId}/member/${user_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ memberId: user_id, feedbackText: editingText }),
        }
      );
      if (!res.ok) throw new Error(await res.text());
      setSuccess("Cập nhật feedback thành công!");
      setEditingId(null);
      setEditingText("");
      // Cập nhật lại danh sách feedback
      setFeedbacks((prev) =>
        prev.map((fb) =>
          fb.feedbackId === feedbackId ? { ...fb, feedbackText: editingText } : fb
        )
      );
    } catch (err) {
      setError(err.message);
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
      const res = await fetch(
        `http://localhost:8080/api/feedbacks/${feedbackId}/member/${user_id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error(await res.text());
      setSuccess("Xóa feedback thành công!");
      // Cập nhật lại danh sách feedback
      setFeedbacks((prev) => prev.filter((fb) => fb.feedbackId !== feedbackId));
    } catch (err) {
      setError(err.message);
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
        <form onSubmit={handleSubmit}>
          <div className={styles.profileItem}>
            <span className={styles.profileItemIcon}>💬</span>
            <textarea
              rows={3}
              style={{ flex: 1, marginLeft: 8, borderRadius: 8, padding: 8, resize: "vertical" }}
              placeholder="Nhập nội dung góp ý của bạn..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            />
          </div>
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <button className={styles.btn} type="submit" disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi feedback"}
            </button>
          </div>
        </form>
      </div>

      <div className={styles.profileBox}>
        <h3 style={{ color: "#f9ac54", textAlign: "center" }}>Lịch sử góp ý của bạn</h3>
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
                  <>
                    {" "}{fb.feedbackText}
                  </>
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
  );
};

export default Feedback;