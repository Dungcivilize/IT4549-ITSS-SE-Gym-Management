import React, { useState, useEffect } from 'react';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function RevenuePage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [monthlyRevenue, setMonthlyRevenue] = useState(Array(12).fill(0));
  const [selectedDate, setSelectedDate] = useState('');
  const [dateRevenue, setDateRevenue] = useState(null);

  useEffect(() => {
    async function fetchMonthlyRevenue() {
      const revenues = [];
      for (let month = 1; month <= 12; month++) {
        try {
          const response = await fetch(`http://localhost:8080/api/revenue/month?month=${month}&year=${year}`);
          const data = await response.json();
          revenues.push(data || 0);
        } catch (error) {
          revenues.push(0);
          console.error('Error fetching monthly revenue:', error);
        }
      }
      setMonthlyRevenue(revenues);
    }
    fetchMonthlyRevenue();
  }, [year]);

  async function fetchDateRevenue() {
    if (!selectedDate) return;
    try {
      const response = await fetch(`http://localhost:8080/api/revenue/date?date=${selectedDate}`);
      const data = await response.json();
      setDateRevenue(data);
    } catch (error) {
      setDateRevenue(null);
      console.error('Error fetching date revenue:', error);
    }
  }

  const data = {
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    datasets: [
      {
        label: `Doanh thu năm ${year} (VNĐ)`,
        data: monthlyRevenue,
        backgroundColor: 'rgba(75,192,192,0.6)',
      },
    ],
  };

  return (
    <div style={{ maxWidth: '900px', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Dashboard Quản Lý Phòng Gym</h1>
      {/* Các card thống kê */}
      <div style={{ display: 'flex', gap: 20, marginTop: 20, marginBottom: 40 }}>
        <div style={{
          flex: 1,
          padding: 20,
          backgroundColor: '#1976d2',
          color: 'white',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}>
          <h3>Tổng Doanh Thu</h3>
          <p style={{ fontSize: 24, fontWeight: 'bold' }}>520 triệu VND</p>
        </div>

        <div style={{
          flex: 1,
          padding: 20,
          backgroundColor: '#388e3c',
          color: 'white',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}>
          <h3>Thành Viên Mới</h3>
          <p style={{ fontSize: 24, fontWeight: 'bold' }}>85 người</p>
        </div>

        <div style={{
          flex: 1,
          padding: 20,
          backgroundColor: '#f57c00',
          color: 'white',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}>
          <h3>Gói VIP</h3>
          <p style={{ fontSize: 24, fontWeight: 'bold' }}>120 người</p>
        </div>
      </div>
      <h2>Doanh thu theo tháng</h2>
      <label>
        Chọn năm:{' '}
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          min="2000"
          max={new Date().getFullYear()}
          style={{ width: '100px', marginBottom: '20px' }}
        />
      </label>

      <Bar data={data} />
    </div>
  );
}

export default RevenuePage;
