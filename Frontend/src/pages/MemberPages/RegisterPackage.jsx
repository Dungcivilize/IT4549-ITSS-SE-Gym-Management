// src/pages/MemberPages/RegisterPackage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../assets/css/RegisterPackage.module.css";
import MemberNavbar from "../../Components/MemberNavbar.jsx";

const RegisterPackage = () => {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainerId, setSelectedTrainerId] = useState("");
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/packages")
      .then((res) => setPackages(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleRowClick = (pkg) => {
    setSelectedPackage(pkg);
    setShowModal(true);
    setSelectedTrainerId(""); // reset PT đã chọn

    if (pkg.pt) {
      axios
        .get(`http://localhost:8080/api/packages/${pkg.packageId}/trainers`)
        .then((res) => setTrainers(res.data))
        .catch((err) => {
          console.error("Lỗi khi lấy danh sách huấn luyện viên:", err);
          setTrainers([]);
        });
    } else {
      setTrainers([]);
    }
  };

  const handleRegister = () => {
    if (!selectedPackage) return;

    if (selectedPackage.pt && !selectedTrainerId) {
      alert("Vui lòng chọn huấn luyện viên trước khi đăng ký!");
      return;
    }

    const payload = {
      memberId: 1, // Thay bằng ID thật nếu có context user login
      trainerId: selectedPackage.pt ? selectedTrainerId || null : null,
      packageId: selectedPackage.packageId,
    };

    setRegistering(true);

    axios
      .post("http://localhost:8080/api/memberships/register", payload)
      .then(() => {
        alert("✅ Bạn đã đăng ký gói tập thành công!");
        setShowModal(false);
      })
      .catch((err) => {
        console.error(err);
        alert("❌ Đăng ký thất bại. Vui lòng thử lại sau.");
      })
      .finally(() => setRegistering(false));
  };

  return (
    <>
      <MemberNavbar />
      <div className={styles.container}>
        <h2 className={styles.title}>📦 Danh sách gói tập</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên gói</th>
              <th>Thời hạn</th>
              <th>Giá</th>
              <th>Loại</th>
              <th>Có PT</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg.packageId} onClick={() => handleRowClick(pkg)}>
                <td>{pkg.packageId}</td>
                <td>{pkg.packageName}</td>
                <td>{pkg.duration} ngày</td>
                <td>{pkg.price.toLocaleString()}₫</td>
                <td>{pkg.packageType}</td>
                <td>{pkg.pt ? "✅" : "❌"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && selectedPackage && (
          <div
            className={styles.modalOverlay}
            onClick={() => setShowModal(false)}
          >
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <button
                className={styles.closeIcon}
                onClick={() => setShowModal(false)}
              >
                ❌
              </button>

              <img
                src="https://levelfyc.com/wp-content/uploads/2024/09/thue-pt-1-1.jpg"
                alt="Package"
                className={styles.image}
              />

              <div className={styles.details}>
                <h3>{selectedPackage.packageName}</h3>
                <p>⏱ Thời hạn: {selectedPackage.duration} ngày</p>
                <p>💸 Giá: {selectedPackage.price.toLocaleString()}₫</p>
                <p>📁 Loại: {selectedPackage.packageType}</p>
                <p>🏋️ Có PT: {selectedPackage.pt ? "Có" : "Không"}</p>

                {selectedPackage.pt ? (
                  trainers.length > 0 ? (
                    <div className={styles.ptDropdown}>
                      <label htmlFor="trainer">Chọn huấn luyện viên:</label>
                      <select
                        id="trainer"
                        value={selectedTrainerId}
                        onChange={(e) => setSelectedTrainerId(e.target.value)}
                      >
                        <option value="">-- Chọn PT --</option>
                        {trainers.map((t) => (
                          <option key={t.userId} value={t.userId}>
                            {t.fullname}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <p className={styles.ptDropdown}>
                      Không tìm thấy huấn luyện viên phù hợp.
                    </p>
                  )
                ) : (
                  <p className={styles.ptDropdown}>
                    Gói tập hiện tại không có PT hỗ trợ.
                  </p>
                )}

                <p className={styles.description}>
                  Gói tập {selectedPackage.packageName} phù hợp cho những người
                  muốn duy trì thể lực bền vững và nâng cao sức khỏe toàn diện
                  trong {selectedPackage.duration} ngày.
                </p>

                <button
                  className={styles.registerBtn}
                  onClick={handleRegister}
                  disabled={registering}
                >
                  {registering ? "Đang xử lý..." : "Đăng ký"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RegisterPackage;
