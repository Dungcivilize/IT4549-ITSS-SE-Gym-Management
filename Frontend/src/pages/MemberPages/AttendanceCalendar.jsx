import React, { useEffect, useState } from 'react';
import { getUser, getUserId } from '../../utils/auth';
import Loading from '../../Components/Loading';
import './AttendanceCalendar.css';

function AttendanceCalendar() {
  const [dates, setDates] = useState([]);
  const [month, setMonth] = useState('2025-06');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const user_id = getUserId();

  useEffect(() => {
    if (!user_id) {
      setError('Không thể xác thực người dùng');
      return;
    }

    setLoading(true);
    setError('');

    fetch(
      `http://localhost:8080/api/attendance/dates/${user_id}?month=${month}`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setDates(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch lỗi:', err);
        setError('Không thể tải dữ liệu chấm công');
        setDates([]);
        setLoading(false);
      });
  }, [month, user_id]);

  const daysInMonth = new Date(
    month.split('-')[0],
    month.split('-')[1],
    0
  ).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const isCheckedIn = (day) => {
    const dayStr = `${month}-${String(day).padStart(2, '0')}`;
    return dates.includes(dayStr);
  };

  const getDayCellClass = (day) => {
    const isChecked = isCheckedIn(day);
    if (isChecked) {
      // You can extend this logic to differentiate between PT sessions and regular sessions
      // For now, treating all checked-in days as PT sessions
      return 'day-cell pt-session';
    }
    return 'day-cell normal-session';
  };

  const renderCalendarGrid = () => {
    const firstDay = new Date(`${month}-01`).getDay();
    const blanks = [];
    const start = firstDay === 0 ? 6 : firstDay - 1;
    
    // Add empty cells for padding
    for (let i = 0; i < start; i++) {
      blanks.push(
        <div key={`blank-${i}`} className="empty-cell"></div>
      );
    }

    // Add day cells
    const dayCells = daysArray.map((day) => {
      const isChecked = isCheckedIn(day);
      return (
        <div
          key={day}
          className={getDayCellClass(day)}
          title={isChecked ? 'Đã chấm công' : 'Chưa chấm công'}
        >
          {day}
          {/* Tooltip hiển thị khi có attendance */}
          {isChecked && (
            <div className="feedback-tooltip">
              ✅ Đã chấm công ngày {day}
            </div>
          )}
        </div>
      );
    });

    return [...blanks, ...dayCells];
  };

  if (!user_id) {
    return (
      <div className="attendance-calendar">
        <div className="error-message">
          Vui lòng đăng nhập để xem lịch chấm công
        </div>
      </div>
    );
  }

  return (
    <div className="attendance-calendar">
      <h3>Lịch chấm công tháng {month}</h3>

      {error && <div className="error-message">{error}</div>}

      <input
        type="month"
        className="month-picker"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      />

      {loading ? (
        <div className="loading-container">
          <Loading message="Đang tải lịch chấm công..." />
        </div>
      ) : (
        <div className="calendar-grid">
          {/* Day names header */}
          {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((dow) => (
            <div key={dow} className="day-name">
              {dow}
            </div>
          ))}
          
          {/* Calendar days */}
          {renderCalendarGrid()}
        </div>
      )}
    </div>
  );
}

export default AttendanceCalendar;