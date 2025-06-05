import React from 'react';
import CurrentPackage from './CurrentPackage';
import AttendanceChart from './AttendanceChart';
import MemberNavbar from '../../Components/MemberNavbar';
import { getUserId } from '../../utils/auth';

const MemberHomePage = () => {
  const memberId = getUserId();

  const pageStyles = {
    pageWrapper: {
      maxWidth: '1200px',
      margin: 'auto',
      padding: '2rem 1rem',
      fontFamily: 'Poppins, sans-serif'
    }
  };

  return (
    <>
      <MemberNavbar />
      <div style={pageStyles.pageWrapper}>
        <CurrentPackage memberId={memberId} />
        <AttendanceChart memberId={memberId} />
      </div>
    </>
  );
};

export default MemberHomePage;
