import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../assets/css/CurrentPackage.module.css";
import QRCodeImage from "../../assets/img/QRCode.jpg";

const CurrentPackage = ({ memberId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [transactionCode, setTransactionCode] = useState("");
  const [paymentMode, setPaymentMode] = useState("pay"); // pay | extend

  useEffect(() => {
    if (!memberId) return;
    axios
      .get(`http://localhost:8080/api/memberships/current/${memberId}`)
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [memberId]);

  const handleCancel = async () => {
    try {
      const payload = { memberId, packageId: data.packageId };
      await axios.post("http://localhost:8080/api/memberships/cancel", payload);
      alert("Đã huỷ gói tập");
      setData(null);
    } catch (err) {
      console.error("❌ Lỗi khi huỷ gói tập:", err);
      alert("Lỗi khi huỷ gói tập");
    } finally {
      setShowConfirm(false);
    }
  };

  const handleExtend = async () => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn gia hạn gói tập?");
    if (!confirmed) return;
    alert("Vui lòng thanh toán để gia hạn!");

    try {
      const payload = { memberId, packageId: data.packageId };
      await axios.post("http://localhost:8080/api/memberships/extend", payload);
      setPaymentMode("extend");
      setShowPaymentModal(true);
    } catch (err) {
      console.error("❌ Lỗi khi gia hạn:", err);
      alert("Gia hạn không thành công!");
    }
  };

  const handleSubmit = async () => {
    if (paymentMode === "extend") {
      alert("🎉 Gia hạn thành công!");
      setShowPaymentModal(false);
      return;
    }

    try {
      const payload = { memberId, packageId: data.packageId };
      await axios.post("http://localhost:8080/api/memberships/pay", payload);
      alert("✅ Thanh toán thành công!");
      setShowPaymentModal(false);
    } catch (err) {
      console.error("❌ Lỗi thanh toán:", err);
      alert("Lỗi khi thanh toán gói tập!");
    }
  };

  if (loading) return <p>Đang tải gói tập...</p>;
  if (!data)
    return (
      <p className={styles.empty}>
        Gói tập hiện tại của bạn sẽ hiển thị ở đây.
      </p>
    );

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.left}>
          <h3 className={styles.packageName}>{data.packageName}</h3>
          <p>
            <strong>Bắt đầu:</strong> {data.startDate}
          </p>
          <p>
            <strong>Kết thúc:</strong> {data.endDate}
          </p>
          <p>
            <strong>Trạng thái thanh toán:</strong> {data.paymentStatus}
          </p>
        </div>

        <div className={styles.right}>
          {data.paymentStatus === "Paid" && (
            <>
              <button className={styles.renewButton} onClick={handleExtend}>
                Gia hạn gói tập
              </button>
              <button
                className={`${styles.btn} ${styles.cancel}`}
                onClick={() => setShowConfirm(true)}
              >
                Huỷ gói tập
              </button>
            </>
          )}

          {data.paymentStatus === "Unpaid" && (
            <button
              className={`${styles.btn} ${styles.pay}`}
              onClick={() => {
                setPaymentMode("pay");
                setShowPaymentModal(true);
              }}
            >
              Thanh toán gói tập
            </button>
          )}

          {data.paymentStatus === "Processing" && (
            <div className={styles.processing}>
              Gói tập đang được xử lý, vui lòng đợi...
            </div>
          )}
        </div>
      </div>

      {showConfirm && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmBox}>
            <p>Bạn có chắc chắn muốn huỷ gói tập?</p>
            <div className={styles.confirmButtons}>
              <button
                onClick={handleCancel}
                className={`${styles.btn} ${styles.yes}`}
              >
                Có
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className={`${styles.btn} ${styles.no}`}
              >
                Không
              </button>
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <button
              className={styles.closeButton}
              onClick={() => setShowPaymentModal(false)}
            >
              <img
                src="https://png.pngtree.com/png-vector/20230515/ourmid/pngtree-3d-cross-button-clipart-vector-png-image_7096963.png"
                alt="Đóng"
                className={styles.closeIcon}
              />
            </button>

            <div className={styles.modalContent}>
              <div className={styles.qrSection}>
                <img
                  src={QRCodeImage}
                  alt="QR Code"
                  className={styles.qrImage}
                />
                <div className={styles.accountInfo}>
                  <strong>Nguyễn Việt Thành</strong>
                  <br />
                  STK: 2680477216
                </div>
              </div>

              <div className={styles.infoSection}>
                <h3>{data.packageName}</h3>
                <p>
                  <strong>Bắt đầu:</strong> {data.startDate}
                </p>
                <p>
                  <strong>Kết thúc:</strong> {data.endDate}
                </p>
                <p>
                  <strong>Trạng thái:</strong> {data.paymentStatus}
                </p>

                <input
                  type="text"
                  placeholder="Nhập mã giao dịch"
                  value={transactionCode}
                  onChange={(e) => setTransactionCode(e.target.value)}
                  className={styles.input}
                />

                <button
                  className={`${styles.btn} ${styles.submit}`}
                  onClick={handleSubmit}
                >
                  GỬI
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentPackage;
