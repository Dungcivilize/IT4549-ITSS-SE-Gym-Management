import React, { useEffect, useState } from "react";
import styles from "../assets/css/MemberHomePage.module.css";
import MemberNavbar from "../components/MemberNavbar";

const MemberProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [success, setSuccess] = useState("");
  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/profile/member/${user.userId}`
        );
        if (!response.ok) {
          throw new Error("Không thể lấy thông tin hội viên");
        }
        const data = await response.json();
        setProfile(data);
        setFormData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user.userId) fetchProfile();
    else {
      setError("Không tìm thấy thông tin người dùng.");
      setLoading(false);
    }
  }, [user.userId]);

  const handleEdit = () => {
    setIsEditing(true);
    setFormData(profile);
    setSuccess("");
    setError("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(profile);
    setSuccess("");
    setError("");
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await fetch(
        `http://localhost:8080/api/profile/update/${user.userId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_name: formData.userName,
            fullname: formData.fullname,
            email: formData.email,
            phone: formData.phone,
            date_of_birth: formData.dateOfBirth,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Cập nhật thất bại!");
      }
      setIsEditing(false);
      setSuccess("Cập nhật thành công!");
      // Reload lại thông tin mới
      const updated = await response.json();
      setProfile((prev) => ({
        ...prev,
        ...formData,
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className={styles.pageWrapper} style={{ minHeight: "100vh", padding: "2rem" }}>
      <MemberNavbar />
      {profile && (
        <div className={styles.profileBox}>
          <h2 style={{ color: "#f9ac54", textAlign: "center" }}>Thông tin hội viên</h2>
          {success && <div style={{ color: "green", textAlign: "center" }}>{success}</div>}
          <div className={styles.profileItem}>
            <span className={styles.profileItemIcon}>👤</span>
            <b>Tên đăng nhập:</b>
            {isEditing ? (
              <input
                name="userName"
                value={formData.userName || ""}
                onChange={handleChange}
                style={{ marginLeft: 8 }}
              />
            ) : (
              <span style={{ marginLeft: 8 }}>{profile.userName}</span>
            )}
          </div>
          <div className={styles.profileItem}>
            <span className={styles.profileItemIcon}>📝</span>
            <b>Họ tên:</b>
            {isEditing ? (
              <input
                name="fullname"
                value={formData.fullname || ""}
                onChange={handleChange}
                style={{ marginLeft: 8 }}
              />
            ) : (
              <span style={{ marginLeft: 8 }}>{profile.fullname}</span>
            )}
          </div>
          <div className={styles.profileItem}>
            <span className={styles.profileItemIcon}>📧</span>
            <b>Email:</b>
            {isEditing ? (
              <input
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                style={{ marginLeft: 8 }}
              />
            ) : (
              <span style={{ marginLeft: 8 }}>{profile.email}</span>
            )}
          </div>
          <div className={styles.profileItem}>
            <span className={styles.profileItemIcon}>📞</span>
            <b>Số điện thoại:</b>
            {isEditing ? (
              <input
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                style={{ marginLeft: 8 }}
              />
            ) : (
              <span style={{ marginLeft: 8 }}>{profile.phone}</span>
            )}
          </div>
          <div className={styles.profileItem}>
            <span className={styles.profileItemIcon}>🎂</span>
            <b>Ngày sinh:</b>
            {isEditing ? (
              <input
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth || ""}
                onChange={handleChange}
                style={{ marginLeft: 8 }}
              />
            ) : (
              <span style={{ marginLeft: 8 }}>{profile.dateOfBirth}</span>
            )}
          </div>
          <div style={{ textAlign: "center", marginTop: 24 }}>
            {isEditing ? (
              <>
                <button className={styles.btn} onClick={handleSave} style={{ marginRight: 8 }}>
                  Lưu
                </button>
                <button className={styles.btn} onClick={handleCancel} style={{ background: "#888" }}>
                  Hủy
                </button>
              </>
            ) : (
              <button className={styles.btn} onClick={handleEdit}>
                Chỉnh sửa thông tin
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberProfile; 