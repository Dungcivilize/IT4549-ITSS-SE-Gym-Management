import React, { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const styles = {
  container: { maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' },
  title: { textAlign: 'center', color: '#1e40af', fontSize: '2rem', fontWeight: 'bold', marginBottom: '30px' },
  form: { display: 'flex', gap: '20px', marginBottom: '40px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' },
  box: { flex: 1, padding: 20, color: 'white', borderRadius: 8, textAlign: 'center' },
  totalMembers: { backgroundColor: "#1976d2" },
  totalPackages: { backgroundColor: "#388e3c" },
  totalEquipments: { backgroundColor: "#f57c00" },
  yearInput: { marginLeft: 10, width: 100, padding: 6, borderRadius: 4, border: '1px solid #ccc' },
};

function RevenuePage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [monthlyRevenue, setMonthlyRevenue] = useState(Array(12).fill(0));

  useEffect(() => {
    async function fetchMonthlyRevenue() {
      try {
        const response = await fetch(`http://localhost:8080/api/revenue/month?year=${year}`);
        const data = await response.json();

        const revenues = Array(12).fill(0);
        for (let monthStr in data) {
          const month = parseInt(monthStr, 10);
          revenues[month - 1] = data[monthStr];
        }
        setMonthlyRevenue(revenues);
      } catch (error) {
        console.error("Error fetching revenue:", error);
      }
    }
    fetchMonthlyRevenue();
  }, [year]);

  const [stats, setStats] = useState({
    totalMembers: 0,
    totalPackages: 0,
    totalEquipments: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("http://localhost:8080/api/statistics/totals");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      }
    }
    fetchStats();
  }, []);

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: `Doanh thu năm ${year} (VNĐ)`,
      data: monthlyRevenue,
      backgroundColor: 'rgba(75,192,192,0.6)',
    }]
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard Doanh Thu Phòng Gym</h1>

      {/* 3 box tổng số */}
      <div style={styles.form}>
        <div style={{ ...styles.box, ...styles.totalMembers }}>
          <h3>Tổng Thành Viên</h3>
          <p style={{ fontSize: 24, fontWeight: "bold" }}>{stats.totalMembers} người</p>
        </div>

        <div style={{ ...styles.box, ...styles.totalPackages }}>
          <h3>Tổng Gói Tập</h3>
          <p style={{ fontSize: 24, fontWeight: "bold" }}>{stats.totalPackages} gói</p>
        </div>

        <div style={{ ...styles.box, ...styles.totalEquipments }}>
          <h3>Tổng Thiết Bị</h3>
          <p style={{ fontSize: 24, fontWeight: "bold" }}>{stats.totalEquipments} cái</p>
        </div>
      </div>
      <h2 style={{ textAlign: 'left' }}>Doanh thu theo tháng</h2>
      <label>
        Chọn năm:
        <input 
          type="number" 
          value={year} 
          onChange={e => setYear(Number(e.target.value))} 
          min="2000" 
          max={new Date().getFullYear()} 
          style={styles.yearInput} 
        />
      </label>

      <Bar data={data} />
    </div>
  );
}

export default RevenuePage;
