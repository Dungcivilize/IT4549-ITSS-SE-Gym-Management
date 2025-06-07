import React from 'react';
import AttendanceCalendar from './AttendanceCalendar';
import MemberNavbar from '../../Components/MemberNavbar';

const SchedulePage = () => {
  const pageStyles = {
    schedulePage: {
      minHeight: '100vh',
      backgroundColor: '#111317',
      background:
        'radial-gradient(circle, rgba(249, 172, 84, 0.3) 0%, rgba(15, 15, 15, 0.95) 70%, #111317 100%)',
      fontFamily: 'Poppins, sans-serif',
      display: 'flex',
      flexDirection: 'column',
    },
    content: {
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      flex: 1,
      width: '100%',
    },
    title: {
      fontSize: '2rem',
      marginBottom: '1.5rem',
      color: '#f9ac54',
      fontWeight: '600',
      textAlign: 'center',
    },
  };

  return (
    <div style={pageStyles.schedulePage}>
      <MemberNavbar />
      <div style={pageStyles.content}>
        <h2 style={pageStyles.title}>Lịch tập của hội viên</h2>
        <AttendanceCalendar />
      </div>
    </div>
  );
};

export default SchedulePage;
