import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// StarRating component hiển thị sao vàng
const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} style={{ color: i <= rating ? '#FFD700' : '#ccc', fontSize: '20px' }}>
        ★
      </span>
    );
  }
  return <>{stars}</>;
};

const styles = {
  container: { maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' },
  title: { textAlign: 'center', color: '#1e40af', fontSize: '2rem', fontWeight: 'bold', marginBottom: '30px' },
  chartContainer: { marginBottom: '40px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' },
  feedbackCard: { padding: '1rem', borderRadius: '10px', backgroundColor: '#f9f9f9', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginBottom: '1rem' },
  feedbackHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
  feedbackDate: { fontSize: '0.8rem', color: 'gray' },
};

function RevenuePage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [monthlyRevenue, setMonthlyRevenue] = useState(Array(12).fill(0));
  const [ageGroupData, setAgeGroupData] = useState([]);
  const [equipmentStatusData, setEquipmentStatusData] = useState({});

  // Đánh giá trung bình và feedback tiêu biểu
  const [averageRating, setAverageRating] = useState(0);
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);
  const [highlightFeedbacks, setHighlightFeedbacks] = useState([]);

  useEffect(() => {
    async function fetchMonthlyRevenue() {
      try {
        const response = await fetch(`http://localhost:8080/api/revenue/monthly?year=${year}`);
        const data = await response.json();

        // data dạng [{ year, month, totalAmount }, ...]
        const revenues = Array(12).fill(0);
        data.forEach(item => {
          revenues[item.month - 1] = item.totalAmount;
        });
        setMonthlyRevenue(revenues);
      } catch (error) {
        console.error("Error fetching revenue:", error);
      }
    }
    fetchMonthlyRevenue();
  }, [year]);

  useEffect(() => {
    async function fetchAgeGroupData() {
      try {
        const response = await fetch("http://localhost:8080/api/statistics/age-groups");
        const data = await response.json();
        setAgeGroupData(data);
      } catch (error) {
        console.error("Failed to fetch age group data:", error);
      }
    }
    fetchAgeGroupData();
  }, []);

  useEffect(() => {
    async function fetchEquipmentStatusData() {
      try {
        const response = await fetch("http://localhost:8080/api/statistics/equipment-status");
        const data = await response.json();
        setEquipmentStatusData(data);
      } catch (error) {
        console.error("Failed to fetch equipment status data:", error);
      }
    }
    fetchEquipmentStatusData();
  }, []);

  // Lấy đánh giá trung bình và feedback tiêu biểu
  useEffect(() => {
    async function fetchFeedbackSummary() {
      try {
        const res = await fetch("http://localhost:8080/api/feedback/summary");
        const data = await res.json();
        setAverageRating(data.averageRating);
        setTotalFeedbacks(data.totalFeedbacks);
      } catch (error) {
        console.error("Failed to fetch feedback summary:", error);
      }
    }
    async function fetchHighlightFeedbacks() {
      try {
        const res = await fetch("http://localhost:8080/api/feedback/highlights");
        const data = await res.json();
        setHighlightFeedbacks(data);
      } catch (error) {
        console.error("Failed to fetch highlight feedbacks:", error);
      }
    }
    fetchFeedbackSummary();
    fetchHighlightFeedbacks();
  }, []);

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: `Doanh thu năm ${year} (VNĐ)`,
      data: monthlyRevenue,
      backgroundColor: 'rgba(75,192,192,0.6)',
    }]
  };

  const ageGroupChartData = {
    labels: ageGroupData.map(item => item.range),
    datasets: [{
      label: 'Số lượng người',
      data: ageGroupData.map(item => item.count),
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
    }]
  };

  const equipmentStatusChartData = {
    labels: Object.keys(equipmentStatusData),
    datasets: [{
      label: 'Thiết bị',
      data: Object.values(equipmentStatusData),
      backgroundColor: ['#4caf50', '#f44336', '#ff9800'],
    }]
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Thống Kê Phòng Gym</h1>

      {/* Doanh thu theo tháng */}
      <div style={styles.chartContainer}>
        <h2>Doanh thu theo tháng</h2>
        <label>
          Chọn năm:
          <input
            type="number"
            value={year}
            onChange={e => setYear(Number(e.target.value))}
            min="2000"
            max={new Date().getFullYear()}
            style={{ marginLeft: 10, width: 100, padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
          />
        </label>
        <Bar data={revenueData} />
      </div>

      {/* Thống kê lứa tuổi */}
      <div style={styles.chartContainer}>
        <h2>Thống kê lứa tuổi người dùng</h2>
        <Bar data={ageGroupChartData} />
      </div>

      {/* Trạng thái thiết bị */}
      <div style={styles.chartContainer}>
        <h2>Trạng thái thiết bị</h2>
        <Pie data={equipmentStatusChartData} />
      </div>

      {/* Đánh giá trung bình */}
      <div style={styles.chartContainer}>
        <h2>Đánh giá trung bình</h2>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{averageRating.toFixed(1)}</span>
          <div style={{ marginLeft: 10 }}>
            <StarRating rating={Math.round(averageRating)} />
          </div>
          <span style={{ marginLeft: 10, color: 'gray' }}>{totalFeedbacks} đánh giá</span>
        </div>
      </div>

      {/* Feedback tiêu biểu */}
      <div style={styles.chartContainer}>
        <h2>Phản hồi tiêu biểu</h2>
        {highlightFeedbacks.length === 0 && <p>Chưa có phản hồi nào.</p>}
        {highlightFeedbacks.map(fb => (
          <div key={fb.feedbackId} style={styles.feedbackCard}>
            <div style={styles.feedbackHeader}>
              <strong>{fb.memberName || 'Người dùng'}</strong>
              <StarRating rating={fb.rating} />
            </div>
            <p>"{fb.feedbackText}"</p>
            <span style={styles.feedbackDate}>{new Date(fb.feedbackDate).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RevenuePage;
