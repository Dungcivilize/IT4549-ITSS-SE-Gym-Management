import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CF5', '#F56292', '#3DD598', '#FFD23F'];

function RevenueStatistics() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [monthlyStats, setMonthlyStats] = useState(null);

  // Lấy doanh thu theo năm (12 tháng)
  useEffect(() => {
    axios.get(`http://localhost:8080/api/receptionist/revenue/annual?year=${year}`)
      .then(res => {
        // Giả sử backend trả về object dạng { monthlyRevenues: [số tiền tháng 1, ..., tháng 12] }
        setMonthlyRevenue(
          res.data.monthlyRevenues.map((revenue, index) => ({
            month: index + 1,
            revenue: revenue
          }))
        );
      })
      .catch(console.error);
  }, [year]);

  // Lấy thống kê chi tiết theo tháng (pie charts)
  useEffect(() => {
    axios.get(`http://localhost:8080/api/receptionist/revenue?year=${year}&month=${selectedMonth}`)
      .then(res => {
        setMonthlyStats(res.data);
      })
      .catch(console.error);
  }, [year, selectedMonth]);

  // Dữ liệu cho pie chart member paid / total
  const pieDataMember = monthlyStats ? [
    { name: 'Paid Members', value: monthlyStats.paidMembers },
    { name: 'Unpaid Members', value: monthlyStats.totalMembers - monthlyStats.paidMembers }
  ] : [];

  // Dữ liệu cho pie chart package distribution
const pieDataPackage = monthlyStats && monthlyStats.membershipPackageCounts
    ? Object.entries(monthlyStats.membershipPackageCounts)
        .map(([name, value]) => ({ name, value }))
    : [];
const top3Packages = [...pieDataPackage]
    .sort((a, b) => b.value - a.value)
    .slice(0, 3)
    .map(pkg => pkg.name);



  return (
    <div style={{ padding: 20 }}>
      <h2>Revenue Statistics for Year {year}</h2>

      <div style={{ marginBottom: 20 }}>
        <label>
          Select Year: 
          <input
            type="number"
            value={year}
            onChange={e => setYear(Number(e.target.value))}
            style={{ marginLeft: 10, width: 80 }}
            min={2000}
            max={2100}
          />
        </label>
      </div>

      <h3>Monthly Revenue (Bar Chart)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthlyRevenue} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={value => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} />
          <Bar dataKey="revenue" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      <div style={{ marginTop: 30 }}>
        <label>
          Select Month: 
          <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))} style={{ marginLeft: 10 }}>
            {[...Array(12).keys()].map(i => (
              <option key={i + 1} value={i + 1}>{`Month ${i + 1}`}</option>
            ))}
          </select>
        </label>
      </div>

      {monthlyStats && (
        <div style={{ display: 'flex', marginTop: 30, justifyContent: 'space-around', flexWrap: 'wrap' }}>
          <div style={{ width: 300, height: 300 }}>
            <h4>Members Paid vs Total</h4>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieDataMember}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {pieDataMember.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ width: 300, height: 300 }}>
            <h4>Member Package Distribution</h4>
            <ResponsiveContainer width="100%" height="100%">
    <PieChart width={400} height={300}>
      <Pie
        data={pieDataPackage}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        label={({ name }) => (top3Packages.includes(name) ? name : '')}
      >
        {pieDataPackage.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default RevenueStatistics;
