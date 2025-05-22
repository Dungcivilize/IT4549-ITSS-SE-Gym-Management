import React from "react";
import styles from "../assets/css/MemberHomePage.module.css";
import CurrentPackage from "./CurrentPackage";
import MemberNavbar from "./MemberNavbar";

const MemberHomePage = () => {
  return (
    <>
      <MemberNavbar />
      <div className={styles.pageWrapper}>
        <CurrentPackage />
      </div>
    </>
  );
};

export default MemberHomePage;
