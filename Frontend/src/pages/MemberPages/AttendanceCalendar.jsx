import React, { useEffect, useState } from 'react';
import { getUser, getUserId } from '../../utils/auth';
import Loading from '../../Components/Loading';

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
    
    fetch(`http://localhost:8080/api/attendance/dates/${user_id}?month=${month}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setDates(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch lỗi:', err);
        setError('Không thể tải dữ liệu chấm công');
        setDates([]);
        setLoading(false);
      });
  }, [month, user_id]);

  const daysInMonth = new Date(month.split('-')[0], month.split('-')[1], 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const isCheckedIn = (day) => {
    const dayStr = `${month}-${String(day).padStart(2, '0')}`;
    return dates.includes(dayStr);
  };

  const styles = {
    attendanceCalendar: {
      maxWidth: '480px',
      margin: '20px auto',
      fontFamily: 'Poppins, sans-serif',
      color: '#ffffff',
      backgroundColor: 'rgba(31, 33, 37, 0.9)',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      backdropFilter: 'blur(10px)'
    },
    title: {
      textAlign: 'center',
      marginBottom: '12px',
      color: '#f9ac54',
      fontSize: '1.5rem',
      fontWeight: '600'
    },
    monthPicker: {
      display: 'block',
      margin: '0 auto 20px auto',
      padding: '8px 12px',
      fontSize: '16px',
      borderRadius: '6px',
      border: '2px solid #35373b',
      backgroundColor: '#1f2125',
      color: '#ffffff',
      cursor: 'pointer',
      transition: 'border-color 0.3s ease',
      outline: 'none',
      fontFamily: 'Poppins, sans-serif'
    },
    calendarGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '8px',
      userSelect: 'none'
    },
    dayName: {
      fontWeight: '700',
      textAlign: 'center',
      color: '#f9ac54',
      padding: '8px 0',
      fontSize: '14px'
    },
    emptyCell: {
      backgroundColor: 'transparent',
      border: 'none'
    },
    dayCell: {
      padding: '10px 0',
      border: '1.5px solid #35373b',
      textAlign: 'center',
      borderRadius: '8px',
      cursor: 'default',
      transition: 'background-color 0.3s ease, border-color 0.3s ease',
      color: '#ffffff',
      backgroundColor: '#1f2125',
      fontSize: '14px',
      fontWeight: '500'
    },
    dayCellCheckedIn: {
      backgroundColor: '#f9ac54',
      borderColor: '#d79447',
      color: '#111317',
      fontWeight: '600'
    },
    dayCellHover: {
      borderColor: '#f9ac54'
    },
    errorMessage: {
      color: '#ef4444',
      textAlign: 'center',
      marginBottom: '1rem',
      padding: '0.75rem',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderRadius: '6px',
      border: '1px solid rgba(239, 68, 68, 0.3)'
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px'
    }
  };

  if (!user_id) {
    return (
      <div style={styles.attendanceCalendar}>
        <div style={styles.errorMessage}>
          Vui lòng đăng nhập để xem lịch chấm công
        </div>
      </div>
    );
  }

  return (
    <div style={styles.attendanceCalendar}>
      <h3 style={styles.title}>Lịch tập tháng {month}</h3>

      {error && <div style={styles.errorMessage}>{error}</div>}

      <input
        type="month"
        style={styles.monthPicker}
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        onFocus={(e) => e.target.style.borderColor = '#f9ac54'}
        onBlur={(e) => e.target.style.borderColor = '#35373b'}
      />

      {loading ? (
        <div style={styles.loadingContainer}>
          <Loading message="Đang tải lịch chấm công..." />
        </div>
      ) : (
        <div style={styles.calendarGrid}>
          {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(dow => (
            <div key={dow} style={styles.dayName}>{dow}</div>
          ))}

          {/* Padding đầu tháng */}
          {(() => {
            const firstDay = new Date(`${month}-01`).getDay();
            const blanks = [];
            const start = firstDay === 0 ? 6 : firstDay - 1;
            for (let i = 0; i < start; i++) {
              blanks.push(<div key={'blank-' + i} style={styles.emptyCell}></div>);
            }
            return blanks;
          })()}

          {daysArray.map(day => {
            const isChecked = isCheckedIn(day);
            return (
              <div
                key={day}
                style={{
                  ...styles.dayCell,
                  ...(isChecked ? styles.dayCellCheckedIn : {})
                }}
                title={isChecked ? 'Đã check-in' : 'Chưa check-in'}
                onMouseEnter={(e) => {
                  if (!isChecked) {
                    e.target.style.borderColor = '#f9ac54';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isChecked) {
                    e.target.style.borderColor = '#35373b';
                  }
                }}
              >
                {day}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AttendanceCalendar;
