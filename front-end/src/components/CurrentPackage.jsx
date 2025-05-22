import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../assets/css/CurrentPackage.module.css";
import PaymentModal from "./PaymentModal";
import CancelConfirmationModal from "./CancelConfirmationModal"; // bạn nhớ tạo thêm file modal này nhé

const CurrentPackage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPack, setSelectedPack] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [memberId, setMemberId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [packToCancel, setPackToCancel] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const { data: fetchedMemberId } = await axios.get(
          `http://localhost:8080/api/profile/members/user/${user.userId}`
        );
        setMemberId(fetchedMemberId);

        const res = await axios.get(
          `http://localhost:8080/api/membership/registered/${fetchedMemberId}`
        );
        setPackages(res.data || []);
      } catch (err) {
        console.error("Lỗi khi lấy gói tập:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.userId) fetchPackages();
  }, [user?.userId]);

  const handleCancel = (pack) => {
    setPackToCancel(pack);
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    alert(
      `✅ Đã gửi yêu cầu huỷ gói: ${packToCancel.packageName || "Không rõ"}`
    );
    setShowCancelModal(false);
    setPackToCancel(null);
  };

  const cancelCancel = () => {
    setShowCancelModal(false);
    setPackToCancel(null);
  };

  const handleExtend = (pack) => {
    alert(`🔁 Gia hạn gói tập: ${pack.packageName}`);
  };

  const handlePay = (pack) => {
    setSelectedPack(pack);
    setShowPaymentModal(true);
  };

  if (loading) {
    return <p className={styles.loading}>⏳ Đang tải gói tập của bạn...</p>;
  }

  if (packages.length === 0) {
    return <p className={styles.loading}>🙁 Bạn chưa đăng ký gói tập nào.</p>;
  }

  return (
    <>
      <div className={styles.container}>
        <h2>📦 Danh sách tất cả gói tập</h2>
        {packages
          .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
          .map((pack, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.leftInfo}>
                <h3>{pack.package?.packageName || pack.packageName}</h3>
                <p>📅 Từ: {pack.startDate}</p>
                <p>📅 Đến: {pack.endDate}</p>
                <p>💬 Trạng thái thanh toán: {pack.paymentStatus}</p>
                {pack.remainingDays !== null && (
                  <p>⏳ Số ngày còn lại: {pack.remainingDays} ngày</p>
                )}
                {pack.paymentNote && <p>📝 Ghi chú: {pack.paymentNote}</p>}
              </div>

              <div className={styles.rightActions}>
                {pack.paymentStatus === "Đã thanh toán" ? (
                  <>
                    <button
                      className={styles.actionButton}
                      onClick={() => handleCancel(pack)}
                    >
                      ❌ Hủy gói tập
                    </button>
                    <button
                      className={styles.actionButton}
                      onClick={() => handleExtend(pack)}
                    >
                      🔁 Gia hạn gói tập
                    </button>
                  </>
                ) : (
                  pack.paymentStatus === "Chờ xác nhận" && (
                    <button
                      className={styles.actionButton}
                      onClick={() => handlePay(pack)}
                    >
                      💳 Thanh toán gói tập
                    </button>
                  )
                )}
              </div>
            </div>
          ))}
      </div>

      {showPaymentModal && selectedPack && memberId && (
        <PaymentModal
          pack={selectedPack}
          user={{ memberId, name: user.userName }}
          onClose={() => setShowPaymentModal(false)}
        />
      )}

      {showCancelModal && packToCancel && (
        <CancelConfirmationModal
          pack={packToCancel}
          user={{ memberId, name: user.userName }}
          onConfirm={() => {
            setShowCancelModal(false);
            window.location.reload();
          }}
          onCancel={() => setShowCancelModal(false)}
        />
      )}
    </>
  );
};

export default CurrentPackage;
