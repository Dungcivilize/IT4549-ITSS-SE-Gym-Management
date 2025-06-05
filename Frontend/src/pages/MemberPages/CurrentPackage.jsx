import React, { useEffect, useState } from "react";
import axios from "axios";
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
      // PayMembershipRequest structure - might need transactionCode
      const payload = {
        memberId,
        packageId: data.packageId,
        transactionCode: "CANCEL_" + Date.now(), // Generate a cancel transaction code
      };

      console.log("🗑️ Sending cancel request:", payload);

      const response = await axios.post(
        "http://localhost:8080/api/memberships/cancel",
        payload
      );

      console.log("✅ Cancel response:", response.data);
      alert("✅ Đã hủy gói tập thành công!");

      // Force refresh data from server
      if (memberId) {
        try {
          const refreshResponse = await axios.get(
            `http://localhost:8080/api/memberships/current/${memberId}`
          );
          setData(refreshResponse.data);
        } catch (refreshErr) {
          // If 404, user has no membership - this is expected after cancel
          if (refreshErr.response?.status === 404) {
            setData(null);
          } else {
            console.error("❌ Error refreshing data:", refreshErr);
            setData(null); // Assume cancelled if can't refresh
          }
        }
      }
    } catch (err) {
      console.error("❌ Lỗi khi hủy gói tập:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });

      const errorMessage = err.response?.data || "Lỗi khi hủy gói tập";
      alert(`❌ ${errorMessage}`);
    } finally {
      setShowConfirm(false);
    }
  };

  const handleExtend = async () => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn gia hạn gói tập?");
    if (!confirmed) return;

    try {
      // PayMembershipRequest structure for extend
      const payload = {
        memberId,
        packageId: data.packageId,
        transactionCode: "EXTEND_PENDING_" + Date.now(),
      };

      console.log("⏰ Sending extend request:", payload);

      const response = await axios.post(
        "http://localhost:8080/api/memberships/extend",
        payload
      );

      console.log("✅ Extend response:", response.data);
      setPaymentMode("extend");
      setShowPaymentModal(true);
      alert("Vui lòng thanh toán để hoàn tất gia hạn!");
    } catch (err) {
      console.error("❌ Lỗi khi gia hạn:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });

      const errorMessage = err.response?.data || "Gia hạn không thành công!";
      alert(`❌ ${errorMessage}`);
    }
  };

  const handleSubmit = async () => {
    if (!transactionCode.trim()) {
      alert("❌ Vui lòng nhập mã giao dịch!");
      return;
    }

    if (paymentMode === "extend") {
      alert("🎉 Gia hạn thành công!");
      setShowPaymentModal(false);
      setTransactionCode("");
      // Refresh data
      if (memberId) {
        axios
          .get(`http://localhost:8080/api/memberships/current/${memberId}`)
          .then((res) => setData(res.data))
          .catch(() => setData(null));
      }
      return;
    }

    try {
      // PayMembershipRequest structure for payment
      const payload = {
        memberId,
        packageId: data.packageId,
        transactionCode: transactionCode.trim(),
      };

      console.log("💳 Sending payment request:", payload);

      const response = await axios.post(
        "http://localhost:8080/api/memberships/pay",
        payload
      );

      console.log("✅ Payment response:", response.data);
      alert("✅ Thanh toán thành công!");
      setShowPaymentModal(false);
      setTransactionCode("");

      // Force refresh data from server
      if (memberId) {
        try {
          const refreshResponse = await axios.get(
            `http://localhost:8080/api/memberships/current/${memberId}`
          );
          setData(refreshResponse.data);
        } catch (refreshErr) {
          console.error("❌ Error refreshing data after payment:", refreshErr);
          // Don't set to null here, keep current data if refresh fails
        }
      }
    } catch (err) {
      console.error("❌ Lỗi thanh toán:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });

      const errorMessage = err.response?.data || "Lỗi khi thanh toán gói tập!";
      alert(`❌ ${errorMessage}`);
    }
  };

  const styles = {
    container: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      fontFamily: "Poppins, sans-serif",
    },
    loading: {
      textAlign: "center",
      color: "#f97316",
      fontSize: "1.2rem",
      padding: "2rem",
    },
    empty: {
      fontStyle: "italic",
      opacity: "0.75",
      fontSize: "1rem",
      textAlign: "center",
      padding: "2rem",
    },
    card: {
      backgroundColor: "#ffffff",
      color: "#1a1a1a",
      padding: "2rem",
      borderRadius: "16px",
      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
      width: "80%",
      maxWidth: "1000px",
      display: "flex",
      justifyContent: "space-between",
      gap: "2rem",
      alignItems: "flex-start",
      flexWrap: "wrap",
    },
    left: {
      flex: 1,
      minWidth: "240px",
    },
    right: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      minWidth: "200px",
    },
    packageName: {
      color: "#f97316",
      fontSize: "1.8rem",
      marginBottom: "1rem",
      fontWeight: "bold",
    },
    infoItem: {
      marginBottom: "0.5rem",
      fontSize: "1rem",
      lineHeight: "1.5",
      color: "#1a1a1a",
    },
    btn: {
      padding: "0.75rem 1.5rem",
      border: "none",
      fontWeight: "bold",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "0.2s ease",
      color: "white",
      fontSize: "1rem",
    },
    renewButton: {
      backgroundColor: "#1e90ff",
      color: "white",
      padding: "10px 20px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
      marginLeft: "10px",
    },
    extendBtn: {
      backgroundColor: "#0ea5e9",
    },
    cancelBtn: {
      backgroundColor: "#ef4444",
    },
    payBtn: {
      backgroundColor: "#f59e0b",
    },
    processing: {
      marginTop: "1rem",
      fontStyle: "italic",
      color: "#f59e0b",
      background: "#fff7ed",
      padding: "0.75rem 1rem",
      borderRadius: "8px",
      borderLeft: "4px solid #f97316",
    },
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.7)",
      zIndex: 999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    confirmBox: {
      background: "rgb(94, 94, 94)",
      padding: "20px",
      borderRadius: "10px",
      textAlign: "center",
      color: "white",
    },
    confirmButtons: {
      marginTop: "15px",
      display: "flex",
      gap: "10px",
      justifyContent: "center",
    },
    yesBtn: {
      backgroundColor: "#ff4d4f",
      color: "white",
    },
    noBtn: {
      backgroundColor: "#ccc",
      color: "black",
    },
    modal: {
      position: "relative",
      background: "white",
      padding: "40px",
      borderRadius: "12px",
      width: "900px",
      boxShadow: "0 0 25px rgba(0, 0, 0, 0.4)",
    },
    closeButton: {
      position: "absolute",
      top: "12px",
      right: "12px",
      background: "transparent",
      border: "none",
      cursor: "pointer",
      padding: 0,
    },
    closeIcon: {
      width: "50px",
      height: "50px",
      objectFit: "contain",
      transition: "transform 0.2s ease",
    },
    modalContent: {
      display: "flex",
      flexDirection: "row",
      gap: "3rem",
      width: "100%",
      alignItems: "flex-start",
    },
    qrSection: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    qrImage: {
      width: "260px",
      height: "260px",
      objectFit: "contain",
      marginBottom: "1rem",
    },
    accountInfo: {
      textAlign: "center",
      fontSize: "15px",
      color: "#333",
      lineHeight: "1.4",
    },
    infoSection: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      gap: "8px",
      paddingTop: "10px",
      paddingBottom: "10px",
    },
    modalTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "10px",
      color: "#000",
    },
    modalInfoItem: {
      fontSize: "15px",
      margin: "2px 0",
      color: "#333",
    },
    input: {
      marginTop: "1rem",
      padding: "10px",
      fontSize: "17px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      width: "100%",
    },
    submitBtn: {
      marginTop: "1rem",
      padding: "12px 20px",
      backgroundColor: "orange",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "16px",
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.loading}>🔄 Đang tải gói tập...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={styles.container}>
        <p style={styles.empty}>Gói tập hiện tại của bạn sẽ hiển thị ở đây.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.left}>
          <h3 style={styles.packageName}>{data.packageName}</h3>
          <p style={styles.infoItem}>
            <strong>Bắt đầu:</strong> {data.startDate}
          </p>
          <p style={styles.infoItem}>
            <strong>Kết thúc:</strong> {data.endDate}
          </p>
          <p style={styles.infoItem}>
            <strong>Trạng thái thanh toán:</strong> {data.paymentStatus}
          </p>
          <p
            style={{
              color: data.ptMeetingDaysLeft === 0 ? "red" : "inherit",
              fontWeight: "bold",
            }}
          >
            <strong>Số buổi PT còn lại:</strong> {data.ptMeetingDaysLeft}
          </p>
        </div>

        <div style={styles.right}>
          {data.paymentStatus === "Paid" && (
            <>
              <button
                style={styles.renewButton}
                onClick={handleExtend}
                onMouseOver={(e) => (e.target.style.opacity = "0.9")}
                onMouseOut={(e) => (e.target.style.opacity = "1")}
              >
                Gia hạn gói tập
              </button>
              <button
                style={{ ...styles.btn, ...styles.cancelBtn }}
                onClick={() => setShowConfirm(true)}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#dc2626")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#ef4444")}
              >
                Hủy gói tập
              </button>
            </>
          )}

          {data.paymentStatus === "Unpaid" && (
            <button
              style={{ ...styles.btn, ...styles.payBtn }}
              onClick={() => {
                setPaymentMode("pay");
                setShowPaymentModal(true);
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#d97706")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#f59e0b")}
            >
              Thanh toán gói tập
            </button>
          )}

          {data.paymentStatus === "Processing" && (
            <div style={styles.processing}>
              Gói tập đang được xử lý, vui lòng đợi...
            </div>
          )}
        </div>
      </div>

      {showConfirm && (
        <div style={styles.overlay}>
          <div style={styles.confirmBox}>
            <p style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>
              Bạn có chắc chắn muốn hủy gói tập?
            </p>
            <div style={styles.confirmButtons}>
              <button
                onClick={handleCancel}
                style={{ ...styles.btn, ...styles.yesBtn }}
              >
                Có
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                style={{ ...styles.btn, ...styles.noBtn }}
              >
                Không
              </button>
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <button
              style={styles.closeButton}
              onClick={() => {
                setShowPaymentModal(false);
                setTransactionCode("");
              }}
            >
              <img
                src="https://png.pngtree.com/png-vector/20230515/ourmid/pngtree-3d-cross-button-clipart-vector-png-image_7096963.png"
                alt="Đóng"
                style={styles.closeIcon}
                onMouseOver={(e) => (e.target.style.transform = "scale(1.2)")}
                onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
              />
            </button>

            <div style={styles.modalContent}>
              <div style={styles.qrSection}>
                <img src={QRCodeImage} alt="QR Code" style={styles.qrImage} />
                <div style={styles.accountInfo}>
                  <strong>Nguyễn Việt Thành</strong>
                  <br />
                  STK: 2680477216
                </div>
              </div>

              <div style={styles.infoSection}>
                <h3 style={styles.modalTitle}>{data.packageName}</h3>
                <p style={styles.modalInfoItem}>
                  <strong>Bắt đầu:</strong> {data.startDate}
                </p>
                <p style={styles.modalInfoItem}>
                  <strong>Kết thúc:</strong> {data.endDate}
                </p>
                <p style={styles.modalInfoItem}>
                  <strong>Giá tiền:</strong>{" "}
                  {data.price?.toLocaleString("vi-VN")}₫
                </p>
                <p style={styles.modalInfoItem}>
                  <strong>Trạng thái:</strong> {data.paymentStatus}
                </p>

                <input
                  type="text"
                  placeholder="Nhập mã giao dịch"
                  value={transactionCode}
                  onChange={(e) => setTransactionCode(e.target.value)}
                  style={styles.input}
                />

                <button style={styles.submitBtn} onClick={handleSubmit}>
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
