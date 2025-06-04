import React, { useEffect, useState } from 'react';
import './AttendanceCalendar.css';

function AttendanceCalendar() {
  const [dates, setDates] = useState([]);
  const [month, setMonth] = useState('2025-06');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const memberId = userData?.user_id;
    if (!memberId) return;

    setLoading(true);
    fetch(`/api/attendance/dates/${memberId}?month=${month}`)
      .then(res => res.json())
      .then(data => {
        setDates(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch lỗi:", err);
        setDates([]);
        setLoading(false);
      });
  }, [month]);

  const daysInMonth = new Date(month.split('-')[0], month.split('-')[1], 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const isCheckedIn = (day) => {
    const dayStr = `${month}-${String(day).padStart(2, '0')}`;
    return dates.includes(dayStr);
  };

  return (
    <div className="attendance-calendar">
      <h3>Lịch tập tháng {month}</h3>

      <input
        type="month"
        className="month-picker"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      />

      <div className="calendar-grid">
        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(dow => (
          <div key={dow} className="day-name">{dow}</div>
        ))}

        {/* Padding đầu tháng */}
        {(() => {
          const firstDay = new Date(`${month}-01`).getDay();
          const blanks = [];
          const start = firstDay === 0 ? 6 : firstDay - 1;
          for (let i = 0; i < start; i++) {
            blanks.push(<div key={'blank-' + i} className="empty-cell"></div>);
          }
          return blanks;
        })()}

        {daysArray.map(day => (
          <div
            key={day}
            className={`day-cell ${isCheckedIn(day) ? 'checked-in' : ''}`}
            title={isCheckedIn(day) ? 'Đã check-in' : 'Chưa check-in'}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AttendanceCalendar;
