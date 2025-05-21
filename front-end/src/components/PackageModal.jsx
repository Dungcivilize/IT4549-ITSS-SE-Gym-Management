import React from "react";
import styles from "../assets/css/Modal.module.css";
import axios from "axios";

const PackageModal = ({ pkg, onClose }) => {
  if (!pkg) return null;

  const handleRegister = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.userId;
    const packageId = pkg.packageId || pkg.id; // fallback nếu không có packageId

    if (!userId || !packageId) {
      alert("⚠️ Thiếu thông tin người dùng hoặc gói tập.");
      return;
    }

    try {
      const { data: memberId } = await axios.get(
        `http://localhost:8080/api/profile/members/user/${userId}`
      );

      const { data: currentPackages } = await axios.get(
        `http://localhost:8080/api/membership/registered/${memberId}`
      );

      const isAlreadyRegistered = currentPackages.some(
        (p) => p.packageId === packageId
      );

      if (isAlreadyRegistered) {
        alert("❌ Bạn đã đăng ký gói tập này rồi.");
        return;
      }

      await axios.post("http://localhost:8080/api/membership/register", {
        memberId,
        packageId,
      });

      alert("✅ Đăng ký gói tập thành công!");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("❌ Lỗi khi đăng ký:", error);
      alert("⚠️ Có lỗi xảy ra khi đăng ký gói tập.");
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>
          ✖
        </button>

        <h2 className={styles.modalTitle}>{pkg.packageName || "Gói tập"}</h2>

        <img
          src="https://getfit-academy.edu.vn/wp-content/uploads/2024/10/img_5091-i-scaled-e1698233903304.jpg"
          alt="Hình gói tập"
          className={styles.packageImage}
        />

        <p>💵 Giá: {pkg.price?.toLocaleString()}đ</p>
        <p>⏱ Thời hạn: {pkg.duration} ngày</p>
        <p>
          📖 Mô tả: Tham gia khóa học <b>{pkg.packageName}</b> để nâng cao sức
          khỏe, cải thiện vóc dáng và tinh thần.
        </p>

        <div className={styles.buttonWrapper}>
          <button className={styles.modalRegisterBtn} onClick={handleRegister}>
            Đăng ký gói tập
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageModal;
