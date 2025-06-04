import React, { useState } from "react";
import styles from "../../assets/css/MemberHomePage.module.css";
import MemberNavbar from "../../Components/MemberNavbar";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newPassword || !rePassword) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    if (newPassword !== rePassword) {
      setError("Mật khẩu nhập lại không khớp.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/profile/update/${user.user_id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: newPassword }),
        }
      );
      if (!response.ok) {
        throw new Error("Đổi mật khẩu thất bại!");
      }
      setSuccess("Đổi mật khẩu thành công!");
      setNewPassword("");
      setRePassword("");
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
        <h2 style={{ color: "#f9ac54", textAlign: "center" }}>Đổi mật khẩu</h2>
        {success && <div style={{ color: "green", textAlign: "center" }}>{success}</div>}
        {error && <div style={{ color: "red", textAlign: "center" }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className={styles.profileItem}>
            <span className={styles.profileItemIcon}>🔑</span>
            <b>Mật khẩu mới:</b>
            <input
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ marginLeft: 8, flex: 1 }}
              autoComplete="new-password"
            />
          </div>
          <div className={styles.profileItem}>
            <span className={styles.profileItemIcon}>🔒</span>
            <b>Nhập lại mật khẩu:</b>
            <input
              type="password"
              name="rePassword"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              style={{ marginLeft: 8, flex: 1 }}
              autoComplete="new-password"
            />
          </div>
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <button className={styles.btn} type="submit" disabled={loading}>
              {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;