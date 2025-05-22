import React, { useState } from "react";
import styles from "../assets/css/CancelModal.module.css";

const CancelConfirmationModal = ({ pack, user, onConfirm, onCancel }) => {
  const [loading, setLoading] = useState(false);

  if (!pack || !user?.memberId || !pack.packageId) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:8080/api/membership/request-cancel",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            memberId: user.memberId,
            packageId: pack.packageId,
            cancelReason: "Tôi không còn nhu cầu tập nữa",
          }),
        }
      );

      if (!res.ok) throw new Error("Request failed");

      alert("✅ Đã gửi yêu cầu huỷ gói tập.");
      onConfirm?.();
    } catch (err) {
      console.error("❌ Lỗi khi gửi yêu cầu huỷ:", err);
      alert("❌ Gửi yêu cầu huỷ thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>❓Bạn chắc chắn muốn huỷ gói tập chứ?</h3>
        <p>
          📦 <strong>Gói tập:</strong>{" "}
          {pack.packageName || pack.package?.packageName || "Không rõ"}
        </p>
        <div className={styles.buttons}>
          <button
            className={styles.okBtn}
            onClick={handleConfirm}
            disabled={loading}
          >
            ✅ {loading ? "Đang gửi..." : "OK, huỷ gói tập"}
          </button>
          <button className={styles.cancelBtn} onClick={onCancel}>
            ❌ Không, tôi không muốn
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelConfirmationModal;
