import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer
} from 'recharts';
import './RevenueStatistics.css'; // import CSS ở đây

const COLORS = ['#f97316', '#f59e0b', '#ffbb28', '#ff8042', '#a28cf5', '#f56292', '#3dd598', '#ffd23f'];

function RevenueStatistics() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [monthlyStats, setMonthlyStats] = useState(null);
  const lightenColor = (color, percent) => {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
    let R = (num >> 16) + amt;
    let G = ((num >> 8) & 0x00FF) + amt;
    let B = (num & 0x0000FF) + amt;

    R = R < 255 ? (R < 0 ? 0 : R) : 255;
    G = G < 255 ? (G < 0 ? 0 : G) : 255;
    B = B < 255 ? (B < 0 ? 0 : B) : 255;

    return "#" + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1);
  };

  useEffect(() => {
    axios.get(`http://localhost:8080/api/receptionist/revenue/annual?year=${year}`)
      .then(res => {
        setMonthlyRevenue(
          res.data.monthlyRevenues.map((revenue, index) => ({
            month: index + 1,
            revenue
          }))
        );
      })
      .catch(console.error);
  }, [year]);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/receptionist/revenue?year=${year}&month=${selectedMonth}`)
      .then(res => setMonthlyStats(res.data))
      .catch(console.error);
  }, [year, selectedMonth]);

  const pieDataMember = monthlyStats ? [
    { name: 'Paid Members', value: monthlyStats.paidMembers },
    { name: 'Unpaid Members', value: monthlyStats.totalMembers - monthlyStats.paidMembers }
  ] : [];

  const pieDataPackage = monthlyStats && monthlyStats.membershipPackageCounts
    ? Object.entries(monthlyStats.membershipPackageCounts).map(([name, value]) => ({ name, value }))
    : [];

  const top3Packages = [...pieDataPackage]
    .sort((a, b) => b.value - a.value)
    .slice(0, 3)
    .map(pkg => pkg.name);

  return (
    <div className="revenue-container">
      <h2>Revenue Statistics for Year {year}</h2>

      <div>
        <label>
          Select Year:
          <input
            type="number"
            value={year}
            onChange={e => setYear(Number(e.target.value))}
            min={2000}
            max={2100}
          />
        </label>
      </div>

      <div className="chart-section">
        <h3>Monthly Revenue (Bar Chart)</h3>
        <div className="bar-chart-wrapper" style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRevenue} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="month" stroke="#f97316" tick={{ fill: '#f97316' }} />
              <YAxis stroke="#f97316" tick={{ fill: '#f97316' }} />
              <Tooltip formatter={value => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} />
              <Bar dataKey="revenue" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <label>
          Select Month:
          <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))}>
            {[...Array(12).keys()].map(i => (
              <option key={i + 1} value={i + 1}>{`Month ${i + 1}`}</option>
            ))}
          </select>
        </label>
      </div>

      {monthlyStats && (
        <div className="pie-charts-wrapper" style={{ marginTop: 40 }}>
          <div className="pie-chart-container" style={{ marginBottom: 40 }}>
            <h4>Members Paid vs Total</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieDataMember}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {pieDataMember.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="pie-chart-container">
            <h4>Member Package Distribution</h4>
            <ResponsiveContainer width="100%" height={225}>
              <PieChart>
                <Pie
                  data={pieDataPackage}
                  dataKey="value"
                  nameKey="name"
                  paddingAngle={0.2}
                  cx="50%"
                  cy="50%"
                  outerRadius={entry => top3Packages.includes(entry.name) ? 110 : 100}  // tăng radius cho to hơn
                  label={false}      // tắt label trên Pie chart
                >
                  {pieDataPackage.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke={top3Packages.includes(entry.name) ? lightenColor(COLORS[index % COLORS.length], 40) : 'none'}
                      strokeWidth={top3Packages.includes(entry.name) ? 2 : 0}   
                    />
                  ))}
                </Pie>
                <Tooltip />
                {/* <Legend verticalAlign="bottom" height={36} /> */}
              </PieChart>
              {/* Hiển thị tên 3 package lớn nhất phía dưới */}
              <div className="top-packages-labels" style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', fontWeight: 600, fontSize: '0.9rem' }}>
                {top3Packages.map(name => {
                  const colorIndex = pieDataPackage.findIndex(pkg => pkg.name === name) % COLORS.length;
                  return (
                    <div key={name} className="package-label" style={{ color: COLORS[colorIndex], display: 'flex', alignItems: 'center', gap: 6, userSelect: 'none', cursor: 'default' }}>
                      ● {name}
                    </div>
                  );
                })}
              </div>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default RevenueStatistics;
