// AttendanceChart.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styles from "../../assets/css/AttendanceChart.module.css";

const AttendanceChart = ({ memberId }) => {
  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [dates, setDates] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!memberId) return;
    axios
      .get(`http://localhost:8080/api/attendance/monthly/${memberId}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error("Lỗi lấy attendance:", err));
  }, [memberId]);

  const handleBarClick = (data) => {
    const month = data.month;
    setSelectedMonth(month);
    axios
      .get(
        `http://localhost:8080/api/attendance/dates/${memberId}?month=${month}`
      )
      .then((res) => {
        setDates(res.data);
        setShowPopup(true);
      });
  };

  return (
    <div className={styles.chartWrapper}>
      <h3 className={styles.title}>📊 Biểu đồ điểm danh theo tháng </h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="total" fill="#4ade80" onClick={handleBarClick} />
        </BarChart>
      </ResponsiveContainer>

      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <h4>📅 Ngày điểm danh trong tháng {selectedMonth}</h4>
            <ul>
              {dates.map((date, index) => (
                <li key={index}>{date}</li>
              ))}
            </ul>
            <button
              className={styles.closeBtn}
              onClick={() => setShowPopup(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceChart;
