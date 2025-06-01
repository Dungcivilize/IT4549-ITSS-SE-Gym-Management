// src/components/MemberNavbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../assets/css/MemberHomePage.module.css";
import logo from "../assets/img/logo.png";

const MemberNavbar = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.nav__logo}>
        <Link to="/member/home">
          <img src={logo} alt="logo" />
        </Link>
      </div>

      <ul className={styles.nav__links}>
        <li className={styles.link}>
          <Link to="/member/home">
            <button>Trang chủ</button>
          </Link>
        </li>
        <li className={styles.link}>
          <Link to="/packages">
            <button>Đăng ký gói tập</button>
          </Link>
        </li>
        <li className={styles.link}>
          <Link to="/schedule">
            <button>Lịch tập</button>
          </Link>
        </li>
        <li className={styles.link}>
          <Link to="/feedback">
            <button>Phản hồi</button>
          </Link>
        </li>
        <li className={styles.link}>
          <Link to="/promotion">
            <button>Khuyến mãi</button>
          </Link>
        </li>
      </ul>

      <div className={styles.nav__auth} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className={styles.user__info} onClick={() => setShowDropdown(!showDropdown)}>
          <span style={{ color: "white", cursor: "pointer" }}>
            👤 {user.fullname || "Hội viên"}
          </span>
          {showDropdown && (
            <div className={styles.dropdown}>
              <Link to="/member/profile" className={styles.dropdown__item}>
                Thông tin hội viên
              </Link>
              <Link to="/member/change-password" className={styles.dropdown__item}>
                Thay đổi mật khẩu
              </Link>
            </div>
          )}
        </div>
        <button className={styles.btn} onClick={handleLogout}>Đăng xuất</button>
      </div>
    </nav>
  );
};

export default MemberNavbar;