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
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// StarRating component hiển thị sao vàng
const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span 
        key={i} 
        className={`star ${i <= rating ? 'filled' : 'empty'}`}
      >
        ★
      </span>
    );
  }
  return <div className="rating-stars">{stars}</div>;
};

function Dashboard() {
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
      backgroundColor: 'rgba(249, 115, 22, 0.7)',
      borderColor: '#f97316',
      borderWidth: 1,
    }]
  };

  const ageGroupChartData = {
    labels: ageGroupData.map(item => item.range),
    datasets: [{
      label: 'Số lượng người',
      data: ageGroupData.map(item => item.count),
      backgroundColor: 'rgba(245, 158, 11, 0.7)',
      borderColor: '#f59e0b',
      borderWidth: 1,
    }]
  };

  const equipmentStatusChartData = {
    labels: Object.keys(equipmentStatusData),
    datasets: [{
      label: 'Thiết bị',
      data: Object.values(equipmentStatusData),
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',   // green
        'rgba(239, 68, 68, 0.8)',   // red  
        'rgba(249, 115, 22, 0.8)'   // orange
      ],
      borderColor: [
        '#22c55e',
        '#ef4444', 
        '#f97316'
      ],
      borderWidth: 2,
    }]
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">GYM Dashboard</h1>

      {/* Doanh thu theo tháng */}
      <div className="chart-container">
        <h2>Doanh thu theo tháng</h2>
        <div className="year-selector">
          <label>
            Chọn năm:
            <input
              type="number"
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              min="2000"
              max={new Date().getFullYear()}
              className="year-input"
            />
          </label>
        </div>
        <Bar data={revenueData} />
      </div>

      <div className="charts-row">
        {/* Thống kê lứa tuổi */}
        <div className="chart-container">
          <h2>Thống kê lứa tuổi người dùng</h2>
          <Bar data={ageGroupChartData} />
        </div>

        {/* Trạng thái thiết bị */}
        <div className="chart-container">
          <h2>Trạng thái thiết bị</h2>
          <Pie data={equipmentStatusChartData} />
        </div>
      </div>

      {/* Đánh giá trung bình */}
      <div className="chart-container">
        <h2>Đánh giá trung bình</h2>
        <div className="rating-display">
          <span className="rating-score">{averageRating.toFixed(1)}</span>
          <StarRating rating={Math.round(averageRating)} />
          <span className="rating-count">{totalFeedbacks} đánh giá</span>
        </div>
      </div>

      {/* Feedback tiêu biểu */}
      <div className="chart-container">
        <h2>Phản hồi tiêu biểu</h2>
        {highlightFeedbacks.length === 0 ? (
          <p className="no-feedback">Chưa có phản hồi nào.</p>
        ) : (
          highlightFeedbacks.map(fb => (
            <div key={fb.feedbackId} className="feedback-card">
              <div className="feedback-header">
                <strong className="feedback-author">{fb.memberName || 'Người dùng'}</strong>
                <StarRating rating={fb.rating} />
              </div>
              <p className="feedback-text">{fb.feedbackText}</p>
              <span className="feedback-date">{new Date(fb.feedbackDate).toLocaleDateString()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;