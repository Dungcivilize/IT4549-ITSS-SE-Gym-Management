import React, { useEffect, useState } from "react";
import axios from "axios";
import MemberNavbar from "./MemberNavbar";
import PackageModal from "./PackageModal";

const PackageList = () => {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/packages")
      .then((res) => setPackages(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handlePackageClick = (pkg) => {
    setSelectedPackage(pkg);
  };

  const closeModal = () => {
    setSelectedPackage(null);
  };

  return (
    <>
      <MemberNavbar />
      <div style={{ padding: "2rem", color: "white" }}>
        <h2>📦 Gói tập có sẵn</h2>
        {packages.length === 0 ? (
          <p>Không có gói tập nào.</p>
        ) : (
          packages.map((pkg, index) => (
            <div
              key={index}
              onClick={() => handlePackageClick(pkg)}
              style={{
                backgroundColor: "#222",
                padding: "1rem",
                marginBottom: "1rem",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              <h3>{pkg.packageName}</h3>
              <p>💵 Giá: {pkg.price.toLocaleString()}đ</p>
              <p>⏱ Thời hạn: {pkg.duration} ngày</p>
              <p>📖 Mô tả: {pkg.description}</p>
            </div>
          ))
        )}
      </div>

      {/* Modal hiển thị thông tin gói tập */}
      <PackageModal pkg={selectedPackage} onClose={closeModal} />
    </>
  );
};

export default PackageList;
