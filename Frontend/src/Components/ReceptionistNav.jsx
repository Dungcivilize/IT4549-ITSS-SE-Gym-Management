import { Link, useLocation } from "react-router-dom";
import '../pages/ReceptionistPages/receptionist.css';

const ReceptionistNav = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname.includes(path);

  const navItems = [
    { to: "revenue", text: "Doanh thu" },
    { to: "equipment", text: "Thiết bị" },
    { to: "membership-approval", text: "Duyệt gói tập" },
    { to: "profile", text: "Thông tin cá nhân" },
  ];

  return (
    <nav className="nav-container">
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={`nav-link ${isActive(item.to) ? "nav-link-active" : ""}`}
        >
          {item.text}
        </Link>
      ))}
    </nav>
  );
};

export default ReceptionistNav;
