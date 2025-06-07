import React from "react";
import styles from "../../assets/css/MemberHomePage.module.css";
import CurrentPackage from "./CurrentPackage";
import AttendanceChart from "./AttendanceChart";
import MemberNavbar from "../../Components/MemberNavbar";

const MemberHomePage = () => {
  const user = JSON.parse(localStorage.getItem("user")); // hoặc sessionStorage
  const memberId = user?.user_id;

  // console.log("📦 user:", user);
  // console.log("📦 memberId truyền vào:", memberId);
  // console.log("👀 user object:", user);

  return (
    <>
      <MemberNavbar />
      <div className={styles.pageWrapper}>
        <CurrentPackage memberId={memberId} />
        <AttendanceChart memberId={memberId} /> {/* ⬅️ chèn ở đây */}
      </div>
    </>
  );
};

export default MemberHomePage;
