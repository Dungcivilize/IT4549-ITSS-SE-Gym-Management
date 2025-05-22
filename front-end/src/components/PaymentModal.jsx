import React, { useState } from "react";
import styles from "../assets/css/PaymentModal.module.css";

const PaymentModal = ({ pack, user, onClose }) => {
  const [paymentCode, setPaymentCode] = useState("");

  if (!pack || !user) return null;

  // Lấy dữ liệu từ pack (ưu tiên trực tiếp, sau đó fallback từ pack.package)
  const packageId = pack.packageId || pack.package?.packageId;
  const packageName =
    pack.packageName || pack.package?.packageName || "Không rõ";
  const price =
    typeof pack.price === "number" ? pack.price : pack.package?.price;
  const duration = pack.duration || pack.package?.duration || "Không rõ";
  const userName = user.name || user.userName || "Không rõ";

  const handleSubmit = async () => {
    if (!paymentCode.trim()) {
      alert("⚠️ Vui lòng nhập mã giao dịch.");
      return;
    }

    console.log("memberId:", user.memberId);
    console.log("packageId:", packageId);
    console.log("paymentCode:", paymentCode);

    try {
      await fetch("http://localhost:8080/api/membership/submit-payment-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: user.memberId,
          packageId,
          paymentNote: paymentCode,
        }),
      });

      alert("✅ Đã ghi nhận thông tin thanh toán.");
      onClose();
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("❌ Gửi thông tin thanh toán thất bại.");
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✖
        </button>
        <h2>💳 Xác nhận thanh toán</h2>

        <p>
          <strong>👤 Người dùng:</strong> {userName}
        </p>
        <p>
          <strong>📦 Gói tập:</strong> {packageName}
        </p>
        <p>
          <strong>💵 Giá:</strong>{" "}
          {price ? `${price.toLocaleString()}đ` : "Không rõ"}
        </p>
        <p>
          <strong>⏱ Thời hạn:</strong> {duration} ngày
        </p>

        <label htmlFor="code">
          <strong>🔢 Mã giao dịch:</strong>
        </label>
        <input
          type="text"
          id="code"
          value={paymentCode}
          onChange={(e) => setPaymentCode(e.target.value)}
          placeholder="Nhập mã giao dịch..."
          className={styles.input}
        />

        <button className={styles.submitBtn} onClick={handleSubmit}>
          ✅ Gửi thông tin thanh toán
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;
