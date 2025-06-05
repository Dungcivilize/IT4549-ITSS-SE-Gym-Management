// src/pages/MemberPages/RegisterPackage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import MemberNavbar from "../../Components/MemberNavbar.jsx";
import { getUserId } from "../../utils/auth";

const RegisterPackage = () => {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainerId, setSelectedTrainerId] = useState("");
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/membership-packages")
      .then((res) => setPackages(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleCardClick = (pkg) => {
    setSelectedPackage(pkg);
    setShowModal(true);
    setSelectedTrainerId(""); // reset PT đã chọn

    if (pkg.pt) {
      axios
        .get(`http://localhost:8080/api/membership-packages/${pkg.packageId}/trainers`)
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

    const currentUserId = getUserId();
    if (!currentUserId) {
      alert("❌ Vui lòng đăng nhập để đăng ký gói tập!");
      return;
    }

    if (selectedPackage.pt && !selectedTrainerId) {
      alert("Vui lòng chọn huấn luyện viên trước khi đăng ký!");
      return;
    }

    const payload = {
      memberId: Number(currentUserId), // Chuyển sang số
      trainerId: selectedPackage.pt ? Number(selectedTrainerId) || null : null, // Chuyển sang số
      packageId: Number(selectedPackage.packageId), // Chuyển sang số
    };

    console.log("Payload gửi đến backend:", payload); // Debug log

    setRegistering(true);

    axios
      .post("http://localhost:8080/api/memberships/register", payload)
      .then(() => {
        alert("✅ Bạn đã đăng ký gói tập thành công!");
        setShowModal(false);
      })
      .catch((err) => {
        console.error("Chi tiết lỗi:", err.response?.data || err.message);
        const errorMessage = err.response?.data || "Đăng ký thất bại. Vui lòng thử lại sau.";
        alert(`❌ ${errorMessage}`);
      })
      .finally(() => setRegistering(false));
  };

  const pageStyles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#111317',
      background: 'radial-gradient(circle, rgba(249, 172, 84, 0.3) 0%, rgba(15, 15, 15, 0.95) 70%, #111317 100%)',
      fontFamily: 'Poppins, sans-serif',
      padding: '2rem'
    },
    content: {
      maxWidth: '1200px',
      margin: 'auto',
      paddingTop: '6rem'
    },
    title: {
      fontSize: '3rem',
      fontWeight: '700',
      textAlign: 'center',
      color: '#f9ac54',
      marginBottom: '3rem'
    },
    subtitle: {
      fontSize: '1.2rem',
      textAlign: 'center',
      color: '#d1d5db',
      marginBottom: '4rem',
      lineHeight: '1.6'
    },
    cardGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '2rem',
      marginBottom: '4rem'
    },
    card: {
      backgroundColor: 'rgba(31, 33, 37, 0.9)',
      borderRadius: '20px',
      padding: '2rem',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(249, 172, 84, 0.1)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden'
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '1.5rem'
    },
    packageName: {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: '#f9ac54',
      marginBottom: '0.5rem'
    },
    packageType: {
      backgroundColor: '#f9ac54',
      color: '#111317',
      padding: '0.3rem 0.8rem',
      borderRadius: '15px',
      fontSize: '0.8rem',
      fontWeight: '600'
    },
    priceSection: {
      textAlign: 'center',
      marginBottom: '1.5rem'
    },
    price: {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#ffffff',
      marginBottom: '0.5rem'
    },
    currency: {
      fontSize: '1rem',
      color: '#f9ac54'
    },
    duration: {
      color: '#d1d5db',
      fontSize: '0.9rem'
    },
    features: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    feature: {
      display: 'flex',
      alignItems: 'center',
      color: '#d1d5db',
      marginBottom: '0.8rem',
      fontSize: '0.95rem'
    },
    featureIcon: {
      marginRight: '0.8rem',
      fontSize: '1.2rem'
    },
    ptBadge: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      backgroundColor: selectedPackage?.pt ? '#10b981' : '#6b7280',
      color: '#ffffff',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: '600'
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(10px)'
    },
    modal: {
      backgroundColor: 'rgba(31, 33, 37, 0.95)',
      borderRadius: '20px',
      padding: '2rem',
      maxWidth: '600px',
      width: '90%',
      maxHeight: '80vh',
      overflowY: 'auto',
      position: 'relative',
      border: '1px solid rgba(249, 172, 84, 0.2)',
      backdropFilter: 'blur(20px)'
    },
    closeBtn: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: '#f9ac54',
      padding: '0.5rem'
    },
    modalTitle: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#f9ac54',
      marginBottom: '1.5rem',
      textAlign: 'center'
    },
    modalDetails: {
      color: '#d1d5db',
      marginBottom: '1.5rem'
    },
    detailItem: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '0.8rem',
      fontSize: '1rem'
    },
    detailIcon: {
      marginRight: '0.8rem',
      fontSize: '1.2rem'
    },
    dropdown: {
      marginBottom: '1.5rem'
    },
    dropdownLabel: {
      display: 'block',
      color: '#f9ac54',
      marginBottom: '0.5rem',
      fontWeight: '600'
    },
    select: {
      width: '100%',
      padding: '0.8rem',
      borderRadius: '8px',
      border: '2px solid #35373b',
      backgroundColor: '#111317',
      color: '#ffffff',
      fontSize: '1rem',
      outline: 'none',
      transition: 'border-color 0.3s ease'
    },
    description: {
      color: '#d1d5db',
      lineHeight: '1.6',
      marginBottom: '2rem',
      padding: '1rem',
      backgroundColor: 'rgba(249, 172, 84, 0.1)',
      borderRadius: '10px',
      border: '1px solid rgba(249, 172, 84, 0.2)'
    },
    registerBtn: {
      width: '100%',
      padding: '1rem 2rem',
      backgroundColor: '#f9ac54',
      color: '#ffffff',
      border: 'none',
      borderRadius: '10px',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      fontFamily: 'Poppins, sans-serif'
    }
  };

  return (
    <div style={pageStyles.container}>
      <MemberNavbar />
      <div style={pageStyles.content}>
        <h1 style={pageStyles.title}>🏋️‍♂️ Gói tập thể hình</h1>
        <p style={pageStyles.subtitle}>
          Lựa chọn gói tập phù hợp với mục tiêu và nhu cầu của bạn. 
          Từ cơ bản đến nâng cao, với hoặc không có huấn luyện viên cá nhân.
        </p>

        <div style={pageStyles.cardGrid}>
            {packages.map((pkg) => (
            <div
              key={pkg.packageId}
              style={pageStyles.card}
              onClick={() => handleCardClick(pkg)}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(249, 172, 84, 0.3)';
                e.currentTarget.style.borderColor = 'rgba(249, 172, 84, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)';
                e.currentTarget.style.borderColor = 'rgba(249, 172, 84, 0.1)';
              }}
            >
              <div style={pageStyles.cardHeader}>
                <div>
                  <h3 style={pageStyles.packageName}>{pkg.packageName}</h3>
                  <span style={pageStyles.packageType}>{pkg.packageType}</span>
                </div>
                <div style={{
                  ...pageStyles.ptBadge,
                  backgroundColor: pkg.pt ? '#10b981' : '#6b7280'
                }}>
                  {pkg.pt ? '✅ Có PT' : '❌ Không PT'}
                </div>
              </div>

              <div style={pageStyles.priceSection}>
                <div style={pageStyles.price}>
                  {pkg.price.toLocaleString()}
                  <span style={pageStyles.currency}>₫</span>
                </div>
                <div style={pageStyles.duration}>{pkg.duration} ngày</div>
              </div>

              <ul style={pageStyles.features}>
                <li style={pageStyles.feature}>
                  <span style={pageStyles.featureIcon}>⏱️</span>
                  Thời hạn: {pkg.duration} ngày
                </li>
                <li style={pageStyles.feature}>
                  <span style={pageStyles.featureIcon}>💰</span>
                  Giá: {pkg.price.toLocaleString()}₫
                </li>
                <li style={pageStyles.feature}>
                  <span style={pageStyles.featureIcon}>📁</span>
                  Loại: {pkg.packageType}
                </li>
                <li style={pageStyles.feature}>
                  <span style={pageStyles.featureIcon}>🏋️‍♂️</span>
                  {pkg.pt ? 'Có huấn luyện viên' : 'Tự tập luyện'}
                </li>
              </ul>
            </div>
            ))}
        </div>

        {showModal && selectedPackage && (
          <div
            style={pageStyles.modalOverlay}
            onClick={() => setShowModal(false)}
          >
            <div style={pageStyles.modal} onClick={(e) => e.stopPropagation()}>
              <button
                style={pageStyles.closeBtn}
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>

              <h3 style={pageStyles.modalTitle}>{selectedPackage.packageName}</h3>
              
              <div style={pageStyles.modalDetails}>
                <div style={pageStyles.detailItem}>
                  <span style={pageStyles.detailIcon}>⏱️</span>
                  Thời hạn: {selectedPackage.duration} ngày
                </div>
                <div style={pageStyles.detailItem}>
                  <span style={pageStyles.detailIcon}>💸</span>
                  Giá: {selectedPackage.price.toLocaleString()}₫
                </div>
                <div style={pageStyles.detailItem}>
                  <span style={pageStyles.detailIcon}>📁</span>
                  Loại: {selectedPackage.packageType}
                </div>
                <div style={pageStyles.detailItem}>
                  <span style={pageStyles.detailIcon}>🏋️</span>
                  Có PT: {selectedPackage.pt ? "Có" : "Không"}
                </div>
              </div>

                {selectedPackage.pt ? (
                  trainers.length > 0 ? (
                  <div style={pageStyles.dropdown}>
                    <label style={pageStyles.dropdownLabel} htmlFor="trainer">
                      Chọn huấn luyện viên:
                    </label>
                      <select
                        id="trainer"
                      style={pageStyles.select}
                        value={selectedTrainerId}
                        onChange={(e) => setSelectedTrainerId(e.target.value)}
                      onFocus={(e) => e.target.style.borderColor = '#f9ac54'}
                      onBlur={(e) => e.target.style.borderColor = '#35373b'}
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
                  <p style={pageStyles.description}>
                    Không tìm thấy huấn luyện viên phù hợp cho gói này.
                    </p>
                  )
                ) : (
                <p style={pageStyles.description}>
                  Gói tập hiện tại không bao gồm dịch vụ huấn luyện viên cá nhân.
                  </p>
                )}

              <div style={pageStyles.description}>
                Gói tập <strong>{selectedPackage.packageName}</strong> phù hợp cho những người
                  muốn duy trì thể lực bền vững và nâng cao sức khỏe toàn diện
                trong {selectedPackage.duration} ngày. Với các thiết bị hiện đại và
                không gian tập luyện chuyên nghiệp.
              </div>

                <button
                style={pageStyles.registerBtn}
                  onClick={handleRegister}
                  disabled={registering}
                onMouseOver={(e) => !registering && (e.target.style.backgroundColor = '#d79447')}
                onMouseOut={(e) => !registering && (e.target.style.backgroundColor = '#f9ac54')}
                >
                {registering ? "Đang xử lý..." : "Đăng ký ngay"}
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterPackage;
