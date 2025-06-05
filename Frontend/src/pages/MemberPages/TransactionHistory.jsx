import React, { useEffect, useState } from "react";
import axios from "axios";
import MemberNavbar from "../../Components/MemberNavbar";
import { getUserId } from "../../utils/auth";

const TransactionHistory = () => {
  const [history, setHistory] = useState([]);
  const memberId = getUserId();

  useEffect(() => {
    if (!memberId) return;
    axios
      .get(`http://localhost:8080/api/memberships/history/${memberId}`)
      .then((res) => setHistory(res.data))
      .catch((err) => console.error("Lỗi khi lấy lịch sử:", err));
  }, [memberId]);

  return (
    <div style={styles.container}>
      <MemberNavbar />
      <div style={styles.content}>
        <h2 style={styles.title}>📋 Lịch sử giao dịch</h2>

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Tên gói</th>
                <th style={styles.th}>Số tiền</th>
                <th style={styles.th}>Ngày thanh toán</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? (
                history.map((item, index) => (
                  <tr key={index}>
                    <td style={styles.td}>{item.packageName}</td>
                    <td style={styles.td}>
                      {item.amount.toLocaleString("vi-VN")}₫
                    </td>
                    <td style={styles.td}>
                      {new Date(item.paymentDate).toLocaleDateString("vi-VN")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={styles.emptyRow}>
                    Không có giao dịch nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle, rgba(249,172,84,0.2) 0%, #111317 100%)",
    fontFamily: "Poppins, sans-serif",
    color: "#fff",
    padding: "2rem",
  },
  content: {
    maxWidth: "1000px",
    margin: "auto",
    paddingTop: "6rem",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "700",
    textAlign: "center",
    color: "#f9ac54",
    marginBottom: "2rem",
  },
  tableContainer: {
    overflowX: "auto",
    backgroundColor: "#1f2125",
    borderRadius: "10px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
    padding: "1rem",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "12px",
    backgroundColor: "#35373b",
    color: "#f9ac54",
    fontSize: "1rem",
  },
  td: {
    padding: "12px",
    borderTop: "1px solid #2c2c2c",
    color: "#e5e7eb",
  },
  emptyRow: {
    textAlign: "center",
    padding: "2rem",
    fontStyle: "italic",
    color: "#9ca3af",
  },
};

export default TransactionHistory;
