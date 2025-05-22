import React, { useEffect, useState } from "react";
import styles from "../assets/css/MemberHomePage.module.css";
import MemberNavbar from "../components/MemberNavbar";

const Feedback = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [memberId, setMemberId] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackText, setFeedbackText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Lấy memberId từ userId
  useEffect(() => {
    const fetchMemberId = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/profile/members/user/${user.userId}`);
        const id = await res.json();
        setMemberId(id);
      } catch (err) {
        setError("Không lấy được memberId");
      }
    };
    if (user.userId) fetchMemberId();
  }, [user.userId]);

  // Lấy feedbacks của member
  useEffect(() => {
    const fetchFeedbacks = async () => {
      if (!memberId) return;
      try {
        const res = await fetch(`http://localhost:8080/api/feedbacks/member/${memberId}`);
        const data = await res.json();
        setFeedbacks(data);
      } catch (err) {
        setError("Không lấy được danh sách feedback");
      }
    };
    fetchFeedbacks();
  }, [memberId, success]);

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
        body: JSON.stringify({ memberId, feedbackText }),
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

  const handleDelete = async (feedbackId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa feedback này?")) return;
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/feedbacks/${feedbackId}/member/${memberId}`,
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
                <b>Nội dung:</b> {fb.feedbackText}
              </div>
              <button
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
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
          ))
        )}
      </div>
    </div>
  );
};

export default Feedback;
