import React, { useEffect, useState } from "react";
import axios from "axios";
import QRCodeImage from "../../assets/img/QRCode.jpg";
import MemberNavbar from "../../Components/MemberNavbar";

const CurrentPackage = ({ memberId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [transactionCode, setTransactionCode] = useState("");
  const [paymentMode, setPaymentMode] = useState("pay"); // pay | extend
  const [paymentStatusInfo, setPaymentStatusInfo] = useState(null);

  // Hàm fetch dữ liệu chung
  const fetchData = async () => {
    if (!memberId) return;
    
    try {
      // Lấy thông tin membership hiện tại
      const membershipResponse = await axios.get(`http://localhost:8080/api/memberships/current/${memberId}`);
      setData(membershipResponse.data);
      
      // Lấy thông tin payment status để kiểm tra reject reason
      const statusResponse = await axios.get(`http://localhost:8080/api/memberships/payment-status/${memberId}`);
      const statuses = statusResponse.data;
      
      if (statuses && statuses.length > 0) {
        // Lấy status gần nhất (có thể là processing hoặc unpaid với reject reason)
        const latestStatus = statuses[0];
        setPaymentStatusInfo(latestStatus);
        console.log("📊 Latest payment status:", latestStatus);
      } else {
        setPaymentStatusInfo(null);
      }
      
    } catch (err) {
      console.log("Lỗi khi tải dữ liệu:", err);
      if (err.response?.status === 404) {
        setData(null);
      }
      setPaymentStatusInfo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Tự động refresh mỗi 15 giây để cập nhật reject reason và payment status
    const interval = setInterval(() => {
      if (memberId) {
        console.log("🔄 Auto refreshing payment status...");
        axios
          .get(`http://localhost:8080/api/memberships/payment-status/${memberId}`)
          .then((res) => {
            if (res.data && res.data.length > 0) {
              const latestStatus = res.data[0];
              // Chỉ cập nhật nếu có thay đổi
              if (JSON.stringify(latestStatus) !== JSON.stringify(paymentStatusInfo)) {
                setPaymentStatusInfo(latestStatus);
                console.log("📊 Auto-refreshed payment status:", latestStatus);
                
                // Hiển thị thông báo nếu có reject reason mới
                if (latestStatus.rejectReason && latestStatus.rejectReason !== paymentStatusInfo?.rejectReason) {
                  console.log("🚨 New reject reason detected:", latestStatus.rejectReason);
                }
              }
            }
          })
          .catch((err) => console.log("Lỗi auto refresh:", err));
      }
    }, 15000);

    return () => clearInterval(interval);
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

      // Refresh data sau khi cancel
      await fetchData();
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
    // Hiện modal payment ngay để nhập transaction code
    setPaymentMode("extend");
    setShowPaymentModal(true);
  };

  const handleSubmit = async () => {
    if (!transactionCode.trim()) {
      alert("❌ Vui lòng nhập mã giao dịch!");
      return;
    }

    try {
      const payload = {
        memberId,
        packageId: data.packageId,
        transactionCode: transactionCode.trim(),
      };

      const apiEndpoint = paymentMode === "extend" 
        ? "http://localhost:8080/api/memberships/extend"
        : "http://localhost:8080/api/memberships/pay";

      const actionName = paymentMode === "extend" ? "gia hạn" : "thanh toán";

      console.log(`💳 Sending ${actionName} with transaction code:`, payload);

      const response = await axios.post(apiEndpoint, payload);

      console.log(`✅ ${actionName} response:`, response.data);
      alert("✅ " + response.data);
      setShowPaymentModal(false);
      setTransactionCode("");

      // Refresh data sau khi hoàn tất
      await fetchData();
    } catch (err) {
      const actionName = paymentMode === "extend" ? "gia hạn" : "thanh toán";
      console.error(`❌ Lỗi ${actionName}:`, {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });

      const errorMessage = err.response?.data || `Lỗi khi ${actionName} gói tập!`;
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
    rejectReason: {
      marginTop: "0.5rem",
      fontSize: "0.9rem",
      color: "#dc2626",
      background: "#fee2e2",
      padding: "0.5rem 0.75rem",
      borderRadius: "6px",
      border: "1px solid #fecaca",
      fontWeight: "500",
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
            <>
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
              
              {paymentStatusInfo && paymentStatusInfo.rejectReason && (
                <div style={styles.rejectReason}>
                  <strong>❌ Lý do từ chối thanh toán:</strong><br />
                  {paymentStatusInfo.rejectReason}
                  {paymentStatusInfo.verifiedDate && (
                    <div style={{ marginTop: "0.25rem", fontSize: "0.8rem", opacity: 0.8 }}>
                      <em>Từ chối lúc: {new Date(paymentStatusInfo.verifiedDate).toLocaleString('vi-VN')}</em>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {data.paymentStatus === "Processing" && (
            <div style={styles.processing}>
              Gói tập đang được xử lý, vui lòng đợi xác nhận từ lễ tân...
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
                <h3 style={styles.modalTitle}>
                  {paymentMode === "extend" ? "Gia hạn gói tập" : "Thanh toán gói tập"} - {data.packageName}
                </h3>
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
