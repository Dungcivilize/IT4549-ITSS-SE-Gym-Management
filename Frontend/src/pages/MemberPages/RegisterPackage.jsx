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
  const [loadingTrainers, setLoadingTrainers] = useState(false);
  const [trainerError, setTrainerError] = useState("");
  const [currentMembership, setCurrentMembership] = useState(null);
  const [checkingMembership, setCheckingMembership] = useState(false);

  useEffect(() => {
    // Load packages và sắp xếp theo discount
    axios
      .get("http://localhost:8080/api/packages")
      .then((res) => {
        // Sắp xếp packages: gói có discount cao hơn sẽ lên trước
        const sortedPackages = res.data.sort((a, b) => {
          // Gói có discount cao hơn sẽ lên trước
          if (b.discount !== a.discount) {
            return b.discount - a.discount;
          }
          // Nếu discount bằng nhau, sắp xếp theo packageId
          return a.packageId - b.packageId;
        });
        setPackages(sortedPackages);
      })
      .catch((err) => console.error("Lỗi khi lấy danh sách gói tập:", err));

    // Check current membership
    const currentUserId = getUserId();
    if (currentUserId) {
      setCheckingMembership(true);
      axios
        .get(`http://localhost:8080/api/memberships/current/${currentUserId}`)
        .then((res) => {
          setCurrentMembership(res.data);
          console.log("Membership hiện tại:", res.data);
        })
        .catch((err) => {
          // 404 là OK - có nghĩa là chưa có membership
          if (err.response?.status !== 404) {
            console.error("Lỗi khi check membership:", err);
          }
          setCurrentMembership(null);
        })
        .finally(() => setCheckingMembership(false));
    }
  }, []);

  const handleCardClick = (pkg) => {
    setSelectedPackage(pkg);
    setShowModal(true);
    setSelectedTrainerId(""); // reset PT đã chọn
    setTrainerError(""); // reset lỗi trainer

    if (pkg.pt) {
      setLoadingTrainers(true);
      console.log(`Đang lấy danh sách trainer cho packageId: ${pkg.packageId}`);
      
      axios
        .get(`http://localhost:8080/api/packages/${pkg.packageId}/trainers`)
        .then((res) => {
          console.log("Danh sách trainer nhận được:", res.data);
          setTrainers(res.data);
          setTrainerError("");
        })
        .catch((err) => {
          console.error("Chi tiết lỗi khi lấy danh sách huấn luyện viên:", {
            message: err.message,
            status: err.response?.status,
            statusText: err.response?.statusText,
            data: err.response?.data,
            url: err.config?.url
          });
          
          let errorMessage = "Không thể tải danh sách huấn luyện viên";
          
          if (err.response?.status === 404) {
            errorMessage = "Không tìm thấy huấn luyện viên cho gói này";
          } else if (err.response?.status === 500) {
            errorMessage = "Lỗi máy chủ, vui lòng thử lại sau";
          } else if (!err.response) {
            errorMessage = "Không thể kết nối đến máy chủ";
          }
          
          setTrainerError(errorMessage);
          setTrainers([]);
        })
        .finally(() => {
          setLoadingTrainers(false);
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

    // Validation chi tiết trước khi gửi
    if (!selectedPackage.packageId) {
      alert("❌ Lỗi: Không tìm thấy ID gói tập!");
      return;
    }

    if (selectedPackage.pt && selectedTrainerId && isNaN(Number(selectedTrainerId))) {
      alert("❌ Lỗi: ID huấn luyện viên không hợp lệ!");
      return;
    }

    if (isNaN(Number(currentUserId))) {
      alert("❌ Lỗi: ID người dùng không hợp lệ!");
      return;
    }

        // Tạo payload khớp với RegisterMembershipRequest DTO
    const payload = {
      memberId: Number(currentUserId),
      packageId: Number(selectedPackage.packageId)
    };

    // Chỉ thêm trainerId nếu gói có PT và đã chọn trainer
    if (selectedPackage.pt && selectedTrainerId) {
      payload.trainerId = Number(selectedTrainerId);
    }

    console.log("📦 Selected package:", selectedPackage);
    console.log("👤 User ID:", currentUserId);
    console.log("🏋️ Trainer ID:", selectedTrainerId);
    console.log("📤 Payload gửi đến backend:", payload);

    setRegistering(true);

    axios
      .post("http://localhost:8080/api/memberships/register", payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        console.log("✅ Đăng ký thành công:", response.data);
        alert("✅ Bạn đã đăng ký gói tập thành công!");
        setShowModal(false);
        // Refresh membership status
        const currentUserId = getUserId();
        if (currentUserId) {
          axios
            .get(`http://localhost:8080/api/memberships/current/${currentUserId}`)
            .then((res) => setCurrentMembership(res.data))
            .catch(() => setCurrentMembership(null));
        }
      })
      .catch((err) => {
        console.error("❌ Chi tiết lỗi đăng ký:", {
          message: err.message,
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          payload: payload
        });
        
        let errorMessage = "Đăng ký thất bại. Vui lòng thử lại sau.";
        
        // Xử lý các lỗi cụ thể từ backend
        const errorData = err.response?.data;
        const errorStatus = err.response?.status;
        
        if (errorStatus === 500) {
          if (typeof errorData === 'string' && errorData.includes('gói tập hiện tại')) {
            errorMessage = "⚠️ Bạn đã có gói tập hiện tại. Không thể đăng ký thêm gói mới!\n\n" +
                          "Vui lòng hoàn thành hoặc hủy gói tập hiện tại trước khi đăng ký gói mới.";
          } else if (typeof errorData === 'string' && errorData.includes('must not be null')) {
            errorMessage = "⚠️ Thiếu thông tin cần thiết!\n\n" +
                          "Vui lòng kiểm tra:\n" +
                          "- Bạn đã đăng nhập chưa?\n" +
                          "- Đã chọn gói tập hợp lệ chưa?\n" +
                          "- Đã chọn huấn luyện viên (nếu cần) chưa?";
          } else {
            errorMessage = "Lỗi máy chủ nội bộ. Vui lòng thử lại sau hoặc liên hệ admin.";
          }
        } else if (errorStatus === 400) {
          errorMessage = "Dữ liệu gửi lên không đúng định dạng. Vui lòng thử lại.";
        } else if (errorStatus === 404) {
          errorMessage = "Không tìm thấy gói tập hoặc huấn luyện viên được chọn.";
        } else if (errorData) {
          errorMessage = errorData;
        }
        
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
    originalPrice: {
      fontSize: '1.5rem',
      fontWeight: '400',
      color: '#9ca3af',
      textDecoration: 'line-through',
      marginBottom: '0.3rem'
    },
    currency: {
      fontSize: '1rem',
      color: '#f9ac54'
    },
    duration: {
      color: '#d1d5db',
      fontSize: '0.9rem'
    },
    discountBadge: {
      position: 'absolute',
      top: '1rem',
      left: '1rem',
      backgroundColor: '#ef4444',
      color: '#ffffff',
      padding: '0.4rem 0.8rem',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: '600',
      zIndex: 2
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
    errorMessage: {
      color: '#ef4444',
      lineHeight: '1.6',
      marginBottom: '1.5rem',
      padding: '1rem',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderRadius: '10px',
      border: '1px solid rgba(239, 68, 68, 0.2)',
      textAlign: 'center'
    },
    loadingMessage: {
      color: '#f9ac54',
      lineHeight: '1.6',
      marginBottom: '1.5rem',
      padding: '1rem',
      backgroundColor: 'rgba(249, 172, 84, 0.1)',
      borderRadius: '10px',
      border: '1px solid rgba(249, 172, 84, 0.2)',
      textAlign: 'center'
    },
    warningMessage: {
      color: '#f59e0b',
      lineHeight: '1.6',
      marginBottom: '2rem',
      padding: '1.5rem',
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      borderRadius: '10px',
      border: '1px solid rgba(245, 158, 11, 0.3)',
      textAlign: 'center',
      fontSize: '1.1rem'
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

  // Hàm tính giá sau khi giảm giá
  const calculateDiscountedPrice = (originalPrice, discount) => {
    return originalPrice * (1 - discount);
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

        {checkingMembership && (
          <div style={pageStyles.loadingMessage}>
            🔄 Đang kiểm tra gói tập hiện tại...
          </div>
        )}

        {currentMembership && (
          <div style={pageStyles.warningMessage}>
            ⚠️ <strong>Thông báo:</strong> Bạn đã có gói tập hiện tại: <strong>{currentMembership.packageName}</strong>
            <br />
            Trạng thái: <strong>{currentMembership.paymentStatus}</strong>
            <br />
            <small>Bạn cần hoàn thành hoặc hủy gói này trước khi đăng ký gói mới.</small>
          </div>
        )}

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
              {/* Discount Badge */}
              {pkg.discount > 0 && (
                <div style={pageStyles.discountBadge}>
                  🔥 -{Math.round(pkg.discount * 100)}%
                </div>
              )}

              <div style={pageStyles.cardHeader}>
                <div>
                  <h3 style={pageStyles.packageName}>{pkg.packageName}</h3>
                  {pkg.packageType && (
                    <span style={pageStyles.packageType}>{pkg.packageType}</span>
                  )}
                </div>
                <div style={{
                  ...pageStyles.ptBadge,
                  backgroundColor: pkg.pt ? '#10b981' : '#6b7280'
                }}>
                  {pkg.pt ? '✅ Có PT' : '❌ Không PT'}
                </div>
              </div>

              <div style={pageStyles.priceSection}>
                {pkg.discount > 0 && (
                  <div style={pageStyles.originalPrice}>
                    {pkg.price.toLocaleString()}₫
                  </div>
                )}
                <div style={pageStyles.price}>
                  {calculateDiscountedPrice(pkg.price, pkg.discount).toLocaleString()}
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
                  Giá: {pkg.discount > 0 ? calculateDiscountedPrice(pkg.price, pkg.discount).toLocaleString() : pkg.price.toLocaleString()}₫
                  {pkg.discount > 0 && <span style={{color: '#ef4444', marginLeft: '0.5rem'}}>(-{Math.round(pkg.discount * 100)}%)</span>}
                </li>
                {pkg.packageType && (
                  <li style={pageStyles.feature}>
                    <span style={pageStyles.featureIcon}>📁</span>
                    Loại: {pkg.packageType}
                  </li>
                )}
                <li style={pageStyles.feature}>
                  <span style={pageStyles.featureIcon}>🏋️‍♂️</span>
                  {pkg.pt ? 'Có huấn luyện viên' : 'Tự tập luyện'}
                </li>
                {pkg.pt && pkg.maxPtMeetingDays && (
                  <li style={pageStyles.feature}>
                    <span style={pageStyles.featureIcon}>📅</span>
                    {pkg.maxPtMeetingDays} buổi PT
                  </li>
                )}
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
                  Giá gốc: {selectedPackage.price.toLocaleString()}₫
                </div>
                {selectedPackage.discount > 0 && (
                  <>
                    <div style={pageStyles.detailItem}>
                      <span style={pageStyles.detailIcon}>🔥</span>
                      Giảm giá: {Math.round(selectedPackage.discount * 100)}%
                    </div>
                    <div style={pageStyles.detailItem}>
                      <span style={pageStyles.detailIcon}>💰</span>
                      Giá sau giảm: {calculateDiscountedPrice(selectedPackage.price, selectedPackage.discount).toLocaleString()}₫
                    </div>
                  </>
                )}
                {selectedPackage.packageType && (
                  <div style={pageStyles.detailItem}>
                    <span style={pageStyles.detailIcon}>📁</span>
                    Loại: {selectedPackage.packageType}
                  </div>
                )}
                <div style={pageStyles.detailItem}>
                  <span style={pageStyles.detailIcon}>🏋️</span>
                  Có PT: {selectedPackage.pt ? "Có" : "Không"}
                </div>
                {selectedPackage.pt && selectedPackage.maxPtMeetingDays && (
                  <div style={pageStyles.detailItem}>
                    <span style={pageStyles.detailIcon}>📅</span>
                    Số buổi PT: {selectedPackage.maxPtMeetingDays} buổi
                  </div>
                )}
              </div>

              {/* Hiển thị mô tả gói tập */}
              {selectedPackage.description && (
                <div style={pageStyles.description}>
                  <strong>📝 Mô tả gói tập:</strong>
                  <br />
                  {selectedPackage.description}
                </div>
              )}

              {selectedPackage.pt && (
                <>
                  {loadingTrainers && (
                    <div style={pageStyles.loadingMessage}>
                      🔄 Đang tải danh sách huấn luyện viên...
                    </div>
                  )}
                  
                  {trainerError && (
                    <div style={pageStyles.errorMessage}>
                      ❌ {trainerError}
                    </div>
                  )}
                  
                  {!loadingTrainers && !trainerError && trainers.length > 0 && (
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
                  )}
                  
                  {!loadingTrainers && !trainerError && trainers.length === 0 && (
                    <div style={pageStyles.description}>
                      Không tìm thấy huấn luyện viên phù hợp cho gói này.
                    </div>
                  )}
                </>
              )}

              <button
                style={{
                  ...pageStyles.registerBtn,
                  backgroundColor: (registering || currentMembership) ? '#6b7280' : '#f9ac54',
                  cursor: (registering || currentMembership) ? 'not-allowed' : 'pointer'
                }}
                onClick={handleRegister}
                disabled={registering || currentMembership}
                onMouseOver={(e) => {
                  if (!registering && !currentMembership) {
                    e.target.style.backgroundColor = '#d79447';
                  }
                }}
                onMouseOut={(e) => {
                  if (!registering && !currentMembership) {
                    e.target.style.backgroundColor = '#f9ac54';
                  }
                }}
              >
                {registering 
                  ? "Đang xử lý..." 
                  : currentMembership 
                    ? "Bạn đã có gói tập" 
                    : selectedPackage.discount > 0
                      ? `Đăng ký ngay - Tiết kiệm ${(selectedPackage.price - calculateDiscountedPrice(selectedPackage.price, selectedPackage.discount)).toLocaleString()}₫`
                      : "Đăng ký ngay"
                }
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterPackage;
