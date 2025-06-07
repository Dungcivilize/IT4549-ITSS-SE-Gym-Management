import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/img/logo.png';
import header from '../../assets/img/header.png';
import class1 from '../../assets/img/class-1.jpg';
import class2 from '../../assets/img/class-2.jpg';
import join from '../../assets/img/join.jpg';
import axios from 'axios';

function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Inject CSS for hover effects
    const style = document.createElement('style');
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
      html {
        scroll-behavior: smooth;
      }
    `;
    document.head.appendChild(style);

    // Handle scroll effect
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      document.head.removeChild(style);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const pageStyles = {
    nav: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      maxWidth: '100%',
      margin: 'auto',
      padding: scrolled ? '0.8rem 2rem' : '1.2rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '2rem',
      fontFamily: 'Poppins, sans-serif',
      backgroundColor: scrolled ? 'rgba(17, 19, 23, 0.95)' : 'rgba(17, 19, 23, 0.7)',
      backdropFilter: 'blur(20px)',
      borderBottom: scrolled ? '1px solid rgba(249, 172, 84, 0.15)' : 'none',
      zIndex: 1000,
      transition: 'all 0.3s ease',
      boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.15)' : 'none'
    },
    navLogo: {
      maxWidth: '150px'
    },
    logoImg: {
      width: '100%',
      display: 'flex'
    },
    navLinks: {
      listStyle: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '3rem',
      margin: 0,
      padding: 0
    },
    link: {
      position: 'relative',
      paddingBottom: '0.75rem',
      color: '#ffffff',
      textDecoration: 'none',
      fontWeight: '500'
    },
    btn: {
      padding: '1rem 2rem',
      outline: 'none',
      border: 'none',
      fontSize: '1rem',
      color: '#ffffff',
      backgroundColor: '#f9ac54',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: '0.3s',
      margin: '2px',
      textDecoration: 'none',
      display: 'inline-block'
    },
    section: {
      maxWidth: '1200px',
      margin: 'auto',
      padding: '5rem 1rem',
      textAlign: 'center'
    },
    sectionTitle: {
      fontSize: '3rem',
      fontWeight: '700',
      marginBottom: '2rem',
      color: '#f9ac54'
    },
    sectionSubtitle: {
      fontSize: '1.2rem',
      marginBottom: '3rem',
      color: '#d1d5db',
      lineHeight: '1.8'
    },
    card: {
      backgroundColor: 'rgba(31, 33, 37, 0.9)',
      padding: '2rem',
      borderRadius: '15px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      backdropFilter: 'blur(10px)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
    },
    cardGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
      marginTop: '3rem'
    }
  };

  return (
    <div style={{
      fontFamily: 'Poppins, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#111317',
      background: 'radial-gradient(circle, rgba(249, 172, 84, 0.3) 0%, rgba(15, 15, 15, 0.95) 70%, #111317 100%)'
    }}>
      <nav style={pageStyles.nav}>
        <div style={{
          maxWidth: '1200px',
          margin: 'auto',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2rem'
        }}>
          <div style={pageStyles.navLogo}>
            <Link to="#">
              <img src={logo} alt="logo" style={pageStyles.logoImg} />
            </Link>
          </div>
          <ul style={pageStyles.navLinks}>
            <li>
              <a 
                href="#trang-chu" 
                style={pageStyles.link}
                className="nav-link-hover"
              >
                Trang chủ
              </a>
            </li>
            <li>
              <a 
                href="#chuong-trinh" 
                style={pageStyles.link}
                className="nav-link-hover"
              >
                Chương trình
              </a>
            </li>
            <li>
              <a 
                href="#dich-vu" 
                style={pageStyles.link}
                className="nav-link-hover"
              >
                Dịch vụ
              </a>
            </li>
            <li>
              <a 
                href="#gioi-thieu" 
                style={pageStyles.link}
                className="nav-link-hover"
              >
                Giới thiệu
              </a>
            </li>
            <li>
              <a 
                href="#cong-dong" 
                style={pageStyles.link}
                className="nav-link-hover"
              >
                Cộng đồng
              </a>
            </li>
          </ul>
          <div>
            <Link 
              to="/login" 
              style={pageStyles.btn}
              onMouseOver={(e) => e.target.style.backgroundColor = '#d79447'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#f9ac54'}
            >
              Đăng nhập
            </Link>
            <Link 
              to="/register" 
              style={pageStyles.btn}
              onMouseOver={(e) => e.target.style.backgroundColor = '#d79447'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#f9ac54'}
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </nav>

      {/* Trang chủ Section */}
      <section id="trang-chu" style={{
        maxWidth: '1200px',
        margin: 'auto',
        padding: '5rem 1rem',
        position: 'relative',
        paddingTop: '8rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        alignItems: 'center',
        gap: '2rem'
      }}>
        <div>
          <h4 style={{
            marginBottom: '1rem',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#f9ac54'
          }}>PHÒNG TẬP TỐT NHẤT THÀNH PHỐ</h4>
          <h1 style={{
            marginBottom: '1rem',
            fontSize: '5rem',
            fontWeight: '700',
            lineHeight: '6rem',
            color: '#ffffff'
          }}>
            <span style={{
              WebkitTextFillColor: 'transparent',
              WebkitTextStroke: '1px #ffffff'
            }}>TẠO</span> DÁNG VÓC HOÀN HẢO
          </h1>
          <p style={{
            marginBottom: '2rem',
            color: '#d1d5db'
          }}>
            Giải phóng tiềm năng của bạn và bắt đầu hành trình hướng tới một con người 
            mạnh mẽ, khỏe khoắn và tự tin hơn. Đăng ký ngay hôm nay và chứng kiến 
            sự thay đổi tuyệt vời mà cơ thể bạn có thể đạt được!
          </p>
          <Link 
            to="/login" 
            style={pageStyles.btn}
            onMouseOver={(e) => e.target.style.backgroundColor = '#d79447'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#f9ac54'}
          >
            Bắt đầu ngay
          </Link>
        </div>
        <div style={{
          position: 'relative'
        }}>
          <img src={header} alt="header" style={{
            maxWidth: '350px',
            margin: 'auto',
            width: '100%',
            display: 'flex'
          }} />
        </div>
      </section>

      {/* Chương trình Section */}
      <section id="chuong-trinh" style={pageStyles.section}>
        <h2 style={pageStyles.sectionTitle}>Chương trình tập luyện</h2>
        <p style={pageStyles.sectionSubtitle}>
          Khám phá các chương trình tập luyện đa dạng được thiết kế phù hợp với mọi cấp độ 
          từ người mới bắt đầu đến VĐV chuyên nghiệp
        </p>
        <div style={pageStyles.cardGrid}>
          <div style={pageStyles.card}
               onMouseOver={(e) => {
                 e.currentTarget.style.transform = 'translateY(-10px)';
                 e.currentTarget.style.boxShadow = '0 12px 40px rgba(249, 172, 84, 0.3)';
               }}
               onMouseOut={(e) => {
                 e.currentTarget.style.transform = 'translateY(0)';
                 e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)';
               }}>
            <img src={class1} alt="Strength Training" style={{
              width: '100%',
              height: '200px',
              objectFit: 'cover',
              borderRadius: '10px',
              marginBottom: '1.5rem'
            }} />
            <h3 style={{color: '#f9ac54', fontSize: '1.5rem', marginBottom: '1rem'}}>
              Tập Sức Mạnh
            </h3>
            <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
              Xây dựng cơ bắp và tăng sức mạnh với các bài tập tạ và máy tập hiện đại
            </p>
          </div>
          <div style={pageStyles.card}
               onMouseOver={(e) => {
                 e.currentTarget.style.transform = 'translateY(-10px)';
                 e.currentTarget.style.boxShadow = '0 12px 40px rgba(249, 172, 84, 0.3)';
               }}
               onMouseOut={(e) => {
                 e.currentTarget.style.transform = 'translateY(0)';
                 e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)';
               }}>
            <img src={class2} alt="Cardio Training" style={{
              width: '100%',
              height: '200px',
              objectFit: 'cover',
              borderRadius: '10px',
              marginBottom: '1.5rem'
            }} />
            <h3 style={{color: '#f9ac54', fontSize: '1.5rem', marginBottom: '1rem'}}>
              Tập Tim Mạch
            </h3>
            <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
              Cải thiện sức bền và đốt cháy calo với các bài tập cardio đa dạng
            </p>
          </div>
          <div style={pageStyles.card}
               onMouseOver={(e) => {
                 e.currentTarget.style.transform = 'translateY(-10px)';
                 e.currentTarget.style.boxShadow = '0 12px 40px rgba(249, 172, 84, 0.3)';
               }}
               onMouseOut={(e) => {
                 e.currentTarget.style.transform = 'translateY(0)';
                 e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)';
               }}>
            <img src={join} alt="Group Training" style={{
              width: '100%',
              height: '200px',
              objectFit: 'cover',
              borderRadius: '10px',
              marginBottom: '1.5rem'
            }} />
            <h3 style={{color: '#f9ac54', fontSize: '1.5rem', marginBottom: '1rem'}}>
              Tập Nhóm
            </h3>
            <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
              Tham gia các lớp tập nhóm vui vẻ như Yoga, Zumba, CrossFit
            </p>
          </div>
        </div>
      </section>

      {/* Dịch vụ Section */}
      <section id="dich-vu" style={pageStyles.section}>
        <h2 style={pageStyles.sectionTitle}>Dịch vụ của chúng tôi</h2>
        <p style={pageStyles.sectionSubtitle}>
          Trải nghiệm dịch vụ cao cấp với đội ngũ huấn luyện viên chuyên nghiệp 
          và trang thiết bị hiện đại nhất
        </p>
        <div style={pageStyles.cardGrid}>
          <div style={pageStyles.card}>
            <div style={{
              fontSize: '3rem',
              color: '#f9ac54',
              marginBottom: '1rem'
            }}>🏋️‍♂️</div>
            <h3 style={{color: '#f9ac54', fontSize: '1.5rem', marginBottom: '1rem'}}>
              Huấn luyện cá nhân
            </h3>
            <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
              Được hướng dẫn 1-1 bởi các HLV chuyên nghiệp với chương trình cá nhân hóa
            </p>
          </div>
          <div style={pageStyles.card}>
            <div style={{
              fontSize: '3rem',
              color: '#f9ac54',
              marginBottom: '1rem'
            }}>🥗</div>
            <h3 style={{color: '#f9ac54', fontSize: '1.5rem', marginBottom: '1rem'}}>
              Tư vấn dinh dưỡng
            </h3>
            <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
              Lập kế hoạch dinh dưỡng khoa học phù hợp với mục tiêu của bạn
            </p>
          </div>
          <div style={pageStyles.card}>
            <div style={{
              fontSize: '3rem',
              color: '#f9ac54',
              marginBottom: '1rem'
            }}>💪</div>
            <h3 style={{color: '#f9ac54', fontSize: '1.5rem', marginBottom: '1rem'}}>
              Đánh giá thể lực
            </h3>
            <p style={{color: '#d1d5db', lineHeight: '1.6'}}>
              Kiểm tra sức khỏe định kỳ và theo dõi tiến độ tập luyện
            </p>
          </div>
        </div>
      </section>

      {/* Giới thiệu Section */}
      <section id="gioi-thieu" style={pageStyles.section}>
        <h2 style={pageStyles.sectionTitle}>Về chúng tôi</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '4rem',
          alignItems: 'center',
          textAlign: 'left'
        }}>
          <div>
            <h3 style={{
              fontSize: '2rem',
              color: '#f9ac54',
              marginBottom: '2rem'
            }}>
              Hơn 10 năm kinh nghiệm
            </h3>
            <p style={{
              color: '#d1d5db',
              lineHeight: '1.8',
              marginBottom: '2rem',
              fontSize: '1.1rem'
            }}>
              Chúng tôi là một trong những phòng tập hàng đầu với đội ngũ huấn luyện viên 
              chuyên nghiệp, trang thiết bị hiện đại và không gian tập luyện thoải mái.
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '2rem',
              marginTop: '2rem'
            }}>
              <div style={{textAlign: 'center'}}>
                <h4 style={{fontSize: '3rem', color: '#f9ac54', fontWeight: '700'}}>1000+</h4>
                <p style={{color: '#d1d5db'}}>Thành viên hài lòng</p>
              </div>
              <div style={{textAlign: 'center'}}>
                <h4 style={{fontSize: '3rem', color: '#f9ac54', fontWeight: '700'}}>50+</h4>
                <p style={{color: '#d1d5db'}}>Huấn luyện viên</p>
              </div>
            </div>
          </div>
          <div>
            <img src={header} alt="About Us" style={{
              width: '100%',
              borderRadius: '15px'
            }} />
          </div>
        </div>
      </section>

      {/* Cộng đồng Section */}
      <section id="cong-dong" style={pageStyles.section}>
        <h2 style={pageStyles.sectionTitle}>Tham gia cộng đồng</h2>
        <p style={pageStyles.sectionSubtitle}>
          Kết nối với hàng nghìn thành viên khác, chia sẻ kinh nghiệm và cùng nhau 
          chinh phục mục tiêu sức khỏe
        </p>
        <div style={{
          backgroundColor: 'rgba(31, 33, 37, 0.9)',
          padding: '3rem',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(10px)',
          marginTop: '3rem'
        }}>
          <h3 style={{
            fontSize: '2rem',
            color: '#f9ac54',
            marginBottom: '2rem'
          }}>
            Sẵn sàng bắt đầu hành trình của bạn?
          </h3>
          <p style={{
            color: '#d1d5db',
            marginBottom: '3rem',
            fontSize: '1.2rem'
          }}>
            Đăng ký ngay hôm nay để nhận ưu đãi đặc biệt cho thành viên mới!
          </p>
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link 
              to="/register" 
              style={{
                ...pageStyles.btn,
                fontSize: '1.2rem',
                padding: '1.5rem 3rem'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#d79447'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#f9ac54'}
            >
              Đăng ký ngay
            </Link>
            <Link 
              to="/login" 
              style={{
                ...pageStyles.btn,
                fontSize: '1.2rem',
                padding: '1.5rem 3rem',
                backgroundColor: 'transparent',
                border: '2px solid #f9ac54'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#f9ac54';
                e.target.style.color = '#ffffff';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#ffffff';
              }}
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </section>

      <footer style={{
        maxWidth: '1200px',
        margin: 'auto',
        padding: '3rem 1rem',
        textAlign: 'center',
        borderTop: '1px solid #35373b',
        color: '#d1d5db'
      }}>
        <p>Bản quyền © 2024 Hệ thống quản lý phòng tập. Mọi quyền được bảo lưu.</p>
      </footer>
    </div>
  );
}

export default Home;
