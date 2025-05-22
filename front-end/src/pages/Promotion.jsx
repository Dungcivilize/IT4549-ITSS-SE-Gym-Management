import React, { useEffect, useState } from "react";
import styles from "../assets/css/MemberHomePage.module.css";
import MemberNavbar from "../components/MemberNavbar";

const Promotion = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/promotions/active");
        if (!res.ok) throw new Error("Không thể lấy danh sách khuyến mãi");
        const data = await res.json();
        setPromotions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  return (
    <div className={styles.pageWrapper} style={{ minHeight: "100vh", padding: "2rem" }}>
      <MemberNavbar />
      <div className={styles.profileBox}>
        <h2 style={{ color: "#f9ac54", textAlign: "center" }}>Khuyến mãi đang áp dụng</h2>
        {loading && <div style={{ color: "#fff", textAlign: "center" }}>Đang tải...</div>}
        {error && <div style={{ color: "red", textAlign: "center" }}>{error}</div>}
        {!loading && !error && promotions.length === 0 && (
          <div style={{ color: "#fff", textAlign: "center" }}>Hiện không có khuyến mãi nào.</div>
        )}
        {!loading && !error && promotions.length > 0 && (
          <div>
            {promotions.map((promo, idx) => (
              <div
                key={promo.promotionName + promo.packageName + idx}
                style={{
                  background: "#333",
                  borderRadius: 8,
                  padding: "1rem",
                  marginBottom: 16,
                  color: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}
              >
                <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#f9ac54" }}>
                  🎁 {promo.promotionName}
                </div>
                <div style={{ margin: "8px 0" }}>
                  <b>Mô tả:</b> {promo.description}
                </div>
                <div>
                  <b>Gói áp dụng:</b> {promo.packageName}
                </div>
                <div>
                  <b>Thời gian áp dụng:</b> {promo.startDate} {"->"} {promo.endDate}
                </div>
                <div>
                  <b>Giảm giá:</b> {promo.discountPercent}%
                </div>
                <div>
                  <b>Giá gốc:</b> {promo.originalPrice.toLocaleString()} VNĐ
                </div>
                <div>
                  <b>Giá sau khuyến mãi:</b> <span style={{ color: "#f9ac54", fontWeight: "bold" }}>{promo.discountedPrice.toLocaleString()} VNĐ</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Promotion;