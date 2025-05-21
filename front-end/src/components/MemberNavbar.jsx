// src/components/MemberNavbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import styles from "../assets/css/MemberHomePage.module.css";
import logo from "../assets/img/logo.png";

const MemberNavbar = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  return (
    <nav className={styles.nav}>
      <div className={styles.nav__logo}>
        <Link to="/member-home">
          <img src={logo} alt="logo" />
        </Link>
      </div>

      <ul className={styles.nav__links}>
        <li className={styles.link}>
          <Link to="/member-home">
            <button>Trang chủ</button>
          </Link>
        </li>
        <li className={styles.link}>
          <Link to="/packages">
            <button>Đăng ký gói tập</button>
          </Link>
        </li>
        <li className={styles.link}>
          <button>Lịch tập</button>
        </li>
        <li className={styles.link}>
          <button>Phản hồi</button>
        </li>
        <li className={styles.link}>
          <button>Khuyến mãi</button>
        </li>
      </ul>

      <div className={styles.nav__auth}>
        <span style={{ marginRight: "1rem", color: "white" }}>
          👤 {user.fullname || "Hội viên"}
        </span>
        <button className={styles.btn}>Đăng xuất</button>
      </div>
    </nav>
  );
};

export default MemberNavbar;
