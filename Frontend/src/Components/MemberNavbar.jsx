import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserName, removeUser } from "../utils/auth";
import logo from "../assets/img/logo.png";

const MemberNavbar = () => {
  const userName = getUserName();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Inject CSS for hover effects and responsive design
    const style = document.createElement("style");
    style.textContent = `
      .nav-link-hover::after {
        content: '';
        position: absolute;
        height: 2px;
        width: 0;
        left: 0;
        bottom: 0;
        background-color: #f9ac54;
        transition: 0.3s;
      }
      .nav-link-hover:hover::after {
        width: 50%;
      }
      
      @media (max-width: 768px) {
        .nav-links-mobile {
          display: none !important;
        }
        .nav-mobile-toggle {
          display: block !important;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.5rem;
        }
      }
      
      @media (min-width: 769px) {
        .nav-mobile-toggle {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => document.head.removeChild(style);
  }, []);

  const handleLogout = () => {
    removeUser();
    navigate("/login");
  };

  const pageStyles = {
    nav: {
      maxWidth: "1200px",
      margin: "auto",
      padding: "1rem 1rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "1rem",
      fontFamily: "Poppins, sans-serif",
      flexWrap: "nowrap",
      minHeight: "60px",
    },
    navLogo: {
      maxWidth: "150px",
    },
    logoImg: {
      width: "100%",
      display: "flex",
    },
    navLinks: {
      listStyle: "none",
      display: "flex",
      alignItems: "center",
      gap: "2rem",
      margin: 0,
      padding: 0,
      flexWrap: "nowrap",
      minWidth: "0",
    },
    link: {
      position: "relative",
      paddingBottom: "0.75rem",
      color: "#ffffff",
      textDecoration: "none",
      fontWeight: "500",
      whiteSpace: "nowrap",
      fontSize: "0.9rem",
    },
    btn: {
      padding: "1rem 2rem",
      outline: "none",
      border: "none",
      fontSize: "1rem",
      color: "#ffffff",
      backgroundColor: "#f9ac54",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "0.3s",
      margin: "2px",
      textDecoration: "none",
      display: "inline-block",
    },
    userInfo: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      position: "relative",
      flexShrink: 0,
    },
    userButton: {
      color: "white",
      cursor: "pointer",
      padding: "0.5rem",
      borderRadius: "4px",
      transition: "background-color 0.3s ease",
    },
    dropdown: {
      position: "absolute",
      top: "100%",
      right: 0,
      backgroundColor: "#1f2125",
      borderRadius: "8px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      padding: "0.5rem 0",
      minWidth: "200px",
      zIndex: 1000,
    },
    dropdownItem: {
      display: "block",
      padding: "0.75rem 1rem",
      color: "#d1d5db",
      textDecoration: "none",
      transition: "background-color 0.3s ease",
    },
  };

  return (
    <nav style={pageStyles.nav}>
      <div style={pageStyles.navLogo}>
        <Link to="/member/home">
          <img src={logo} alt="logo" style={pageStyles.logoImg} />
        </Link>
      </div>

      <ul style={pageStyles.navLinks} className="nav-links-mobile">
        <li>
          <Link
            to="/member/home"
            style={pageStyles.link}
            className="nav-link-hover"
          >
            Trang chủ
          </Link>
        </li>
        <li>
          <Link
            to="/packages"
            style={pageStyles.link}
            className="nav-link-hover"
          >
            Đăng ký gói
          </Link>
        </li>
        <li>
          <Link
            to="/schedule"
            style={pageStyles.link}
            className="nav-link-hover"
          >
            Lịch tập
          </Link>
        </li>
        <li>
          <Link
            to="/feedback"
            style={pageStyles.link}
            className="nav-link-hover"
          >
            Phản hồi
          </Link>
        </li>
        <li>
          <Link
            to="/transactions"
            style={pageStyles.link}
            className="nav-link-hover"
          >
            Giao dịch
          </Link>
        </li>
      </ul>
      
      <div className="nav-mobile-toggle" style={{ display: 'none' }}>
        ☰
      </div>

      <div style={pageStyles.userInfo}>
        <div>
          <div
            style={pageStyles.userButton}
            onClick={() => setShowDropdown(!showDropdown)}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#35373b")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
          >
            👤 {userName}
          </div>
          {showDropdown && (
            <div style={pageStyles.dropdown}>
              <Link
                to="/member/profile"
                style={pageStyles.dropdownItem}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#35373b")
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
                onClick={() => setShowDropdown(false)}
              >
                Thông tin hội viên
              </Link>
              <Link
                to="/member/change-password"
                style={pageStyles.dropdownItem}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#35373b")
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
                onClick={() => setShowDropdown(false)}
              >
                Thay đổi mật khẩu
              </Link>
            </div>
          )}
        </div>
        <button
          style={pageStyles.btn}
          onClick={handleLogout}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#d79447")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#f9ac54")}
        >
          Đăng xuất
        </button>
      </div>
    </nav>
  );
};

export default MemberNavbar;