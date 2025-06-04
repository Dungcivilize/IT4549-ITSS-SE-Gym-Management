import React from 'react';
import AttendanceCalendar from './AttendanceCalendar';
import MemberNavbar from '../../Components/MemberNavbar';
import './SchedulePage.css';

const SchedulePage = () => {
  return (
    <div className="schedule-page">
      <MemberNavbar />
      <div className="schedule-page__content">
        <h2 className="schedule-page__title">Lịch tập của hội viên</h2>
        <AttendanceCalendar />
      </div>
    </div>
  );
};

export default SchedulePage;
