import React, { useEffect, useState } from "react";
import axios from "axios";

const CurrentPackage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const { data: memberId } = await axios.get(
          `http://localhost:8080/api/profile/members/user/${user.userId}`
        );

        const res = await axios.get(
          `http://localhost:8080/api/membership/registered/${memberId}`
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

  const btnStyle = {
    padding: "8px 12px",
    marginRight: "8px",
    backgroundColor: "#ffc107",
    color: "black",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const handlePay = (pack) => {
    alert(`💳 Thanh toán cho gói: ${pack.packageName}`);
    // TODO: gọi API thanh toán tại đây
  };

  const handleCancel = (pack) => {
    alert(`❌ Hủy gói: ${pack.packageName}`);
    // TODO: gọi API hủy tại đây
  };

  const handleExtend = (pack) => {
    alert(`🔄 Gia hạn gói: ${pack.packageName}`);
    // TODO: gọi API gia hạn tại đây
  };

  if (loading) {
    return <p style={{ padding: "2rem" }}>⏳ Đang tải gói tập của bạn...</p>;
  }

  if (packages.length === 0) {
    return <p style={{ padding: "2rem" }}>🙁 Bạn chưa đăng ký gói tập nào.</p>;
  }

  return (
    <div style={{ padding: "2rem", color: "white" }}>
      <h2>📦 Danh sách tất cả gói tập</h2>

      {packages
        .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
        .map((pack, index) => (
          <div
            key={index}
            style={{
              background: "#2a2a2a",
              padding: "1.5rem",
              borderRadius: "8px",
              marginBottom: "1.5rem",
            }}
          >
            <h3>{pack.packageName}</h3>
            <p>📅 Từ: {pack.startDate}</p>
            <p>📅 Đến: {pack.endDate}</p>
            <p>💬 Trạng thái thanh toán: {pack.paymentStatus}</p>
            {pack.remainingDays !== null && (
              <p>⏳ Số ngày còn lại: {pack.remainingDays} ngày</p>
            )}
            {pack.paymentNote && <p>📝 Ghi chú: {pack.paymentNote}</p>}

            <div style={{ marginTop: "1rem" }}>
              {pack.paymentStatus === "Đã thanh toán" && (
                <>
                  <button style={btnStyle} onClick={() => handleCancel(pack)}>
                    ❌ Hủy gói tập
                  </button>
                  <button style={btnStyle} onClick={() => handleExtend(pack)}>
                    🔄 Gia hạn
                  </button>
                </>
              )}

              {pack.paymentStatus === "Chờ xác nhận" && (
                <button style={btnStyle} onClick={() => handlePay(pack)}>
                  💳 Thanh toán
                </button>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default CurrentPackage;
