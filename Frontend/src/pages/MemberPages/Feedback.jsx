import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MemberNavbar from '../../Components/MemberNavbar';
import { getUser, getUserId } from '../../utils/auth';
import Loading from '../../Components/Loading';

// Component hiển thị và chọn rating sao
const StarRating = ({ rating, onRatingChange, readonly = false, size = 24 }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (starValue) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starValue);
    }
  };

  const handleStarHover = (starValue) => {
    if (!readonly) {
      setHoverRating(starValue);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  // Nếu readonly, chỉ hiển thị đúng số sao theo rating
  if (readonly) {
    return (
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        {Array.from({ length: rating || 0 }, (_, index) => (
          <span
            key={index}
            style={{
              fontSize: `${size}px`,
              color: '#f9ac54',
              userSelect: 'none'
            }}
          >
            ⭐
          </span>
        ))}
      </div>
    );
  }

  // Nếu không readonly, hiển thị 5 sao với interaction
  return (
    <div 
      style={{ 
        display: 'flex', 
        gap: '4px', 
        alignItems: 'center',
        cursor: 'pointer'
      }}
      onMouseLeave={handleMouseLeave}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = hoverRating ? star <= hoverRating : star <= rating;
        return (
          <span
            key={star}
            style={{
              fontSize: `${size}px`,
              color: isActive ? '#f9ac54' : '#4a5568',
              transition: 'color 0.2s ease',
              cursor: 'pointer',
              userSelect: 'none'
            }}
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleStarHover(star)}
          >
            ⭐
          </span>
        );
      })}
      <span style={{ 
        marginLeft: '8px', 
        color: '#d1d5db', 
        fontSize: '14px' 
      }}>
        ({rating || hoverRating || 0}/5)
      </span>
    </div>
  );
};

const Feedback = () => {
  const user = getUser() || {};
  const user_id = getUserId();
  
  // Early return if no user
  if (!user_id) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#111317',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontFamily: 'Poppins, sans-serif'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          backgroundColor: 'rgba(31, 33, 37, 0.9)',
          borderRadius: '12px'
        }}>
          <h2 style={{ color: '#f9ac54', marginBottom: '1rem' }}>
            Không thể truy cập trang
          </h2>
          <p style={{ color: '#d1d5db' }}>
            Vui lòng đăng nhập để sử dụng tính năng này
          </p>
        </div>
      </div>
    );
  }

  const [allFeedbacks, setAllFeedbacks] = useState([]);
  const [displayedFeedbacks, setDisplayedFeedbacks] = useState([]);
  const [showAllFeedbacks, setShowAllFeedbacks] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [editingRating, setEditingRating] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMyFeedbacks, setShowMyFeedbacks] = useState(false);
  const [myFeedbacks, setMyFeedbacks] = useState([]);

  // Lấy tất cả feedbacks
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/feedbacks/all');
        // Sắp xếp theo feedbackId giảm dần để lấy feedback mới nhất
        const sortedFeedbacks = res.data.sort((a, b) => b.feedbackId - a.feedbackId);
        setAllFeedbacks(sortedFeedbacks);
        // Hiển thị 5 feedback mới nhất
        setDisplayedFeedbacks(sortedFeedbacks.slice(0, 5));
      } catch (err) {
        setError('Không lấy được danh sách feedback');
      }
    };
    fetchFeedbacks();
  }, [success, editingId]); // Refresh khi có thay đổi

  // Hiển thị tất cả feedback
  const handleShowAllFeedbacks = () => {
    setDisplayedFeedbacks(allFeedbacks);
    setShowAllFeedbacks(true);
  };

  // Lấy feedback của user
  const fetchMyFeedbacks = async () => {
    if (!user_id) return;
    try {
      const res = await axios.get(`http://localhost:8080/api/feedbacks/member/${user_id}`);
      setMyFeedbacks(res.data);
    } catch (err) {
      setError('Không lấy được danh sách feedback của bạn');
    }
  };

  // Gửi feedback mới
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!feedbackText.trim()) {
      setError('Nội dung feedback không được để trống');
      return;
    }
    if (!rating || rating === 0) {
      setError('Vui lòng chọn đánh giá từ 1 đến 5 sao');
      return;
    }
    setLoading(true);
    try {
      await axios.post('http://localhost:8080/api/feedbacks', {
        memberId: user_id,
        feedbackText: feedbackText.trim(),
        rating: rating
      });
      setSuccess('Gửi feedback thành công!');
      setFeedbackText('');
      setRating(0);
      setShowAddModal(false);
      // Reset về hiển thị 5 feedback mới nhất
      setShowAllFeedbacks(false);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Bắt đầu chỉnh sửa feedback
  const handleEdit = (fb) => {
    try {
      setError('');
      setSuccess('');
      setEditingId(fb.feedbackId);
      setEditingText(fb.feedbackText);
      setEditingRating(fb.rating || 0);
    } catch (err) {
      console.error('Error setting edit mode:', err);
      setError('Có lỗi xảy ra khi chỉnh sửa');
    }
  };

  // Lưu chỉnh sửa feedback
  const handleSaveEdit = async (feedbackId) => {
    setError('');
    setSuccess('');
    
    if (!feedbackId) {
      setError('ID feedback không hợp lệ');
      return;
    }
    
    if (!user_id) {
      setError('Thông tin người dùng không hợp lệ');
      return;
    }
    
    if (!editingText.trim()) {
      setError('Nội dung feedback không được để trống');
      return;
    }
    
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:8080/api/feedbacks/${feedbackId}/member/${user_id}`,
        {
          memberId: user_id,
          feedbackText: editingText.trim(),
          rating: editingRating
        }
      );
      
      // Update myFeedbacks state immediately for modal
      setMyFeedbacks(prev => {
        if (!prev || !Array.isArray(prev)) return [];
        return prev.map(fb => 
          fb.feedbackId === feedbackId 
            ? { ...fb, feedbackText: editingText.trim(), rating: editingRating }
            : fb
        );
      });
      
      setSuccess('Cập nhật feedback thành công!');
      setEditingId(null);
      setEditingText('');
      setEditingRating(0);
      
    } catch (err) {
      console.error('Error updating feedback:', err);
      setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra khi cập nhật feedback');
    } finally {
      setLoading(false);
    }
  };

  // Hủy chỉnh sửa feedback
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText('');
    setEditingRating(0);
  };

  // Xóa feedback
  const handleDelete = async (feedbackId) => {
    if (!feedbackId) {
      setError('ID feedback không hợp lệ');
      return;
    }
    
    if (!user_id) {
      setError('Thông tin người dùng không hợp lệ');
      return;
    }
    
    if (!window.confirm('Bạn có chắc chắn muốn xóa feedback này?')) return;
    
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      await axios.delete(
        `http://localhost:8080/api/feedbacks/${feedbackId}/member/${user_id}`
      );
      
      // Remove from myFeedbacks state immediately for modal
      setMyFeedbacks(prev => {
        if (!prev || !Array.isArray(prev)) return [];
        return prev.filter(fb => fb.feedbackId !== feedbackId);
      });
      
      setSuccess('Xóa feedback thành công!');
      
    } catch (err) {
      console.error('Error deleting feedback:', err);
      setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra khi xóa feedback');
    } finally {
      setLoading(false);
    }
  };

  const pageStyles = {
    pageWrapper: {
      minHeight: '100vh',
      backgroundColor: '#111317',
      background: 'radial-gradient(circle, rgba(249, 172, 84, 0.3) 0%, rgba(15, 15, 15, 0.95) 70%, #111317 100%)',
      fontFamily: 'Poppins, sans-serif',
      padding: '0'
    },
    contentWrapper: {
      maxWidth: '1200px',
      margin: 'auto',
      padding: '2rem 1rem',
      color: '#ffffff'
    },
    profileBox: {
      backgroundColor: 'rgba(31, 33, 37, 0.9)',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      backdropFilter: 'blur(10px)',
      marginTop: '2rem'
    },
    title: {
      color: '#f9ac54',
      textAlign: 'center',
      fontSize: '2rem',
      fontWeight: '600',
      marginBottom: '2rem'
    },
    successMessage: {
      color: '#10b981',
      textAlign: 'center',
      marginBottom: '1rem',
      padding: '0.75rem',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderRadius: '6px',
      border: '1px solid rgba(16, 185, 129, 0.3)'
    },
    errorMessage: {
      color: '#ef4444',
      textAlign: 'center',
      marginBottom: '1rem',
      padding: '0.75rem',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderRadius: '6px',
      border: '1px solid rgba(239, 68, 68, 0.3)'
    },
    formGroup: {
      marginBottom: '1.5rem'
    },
    label: {
      color: '#d1d5db',
      marginRight: '1rem',
      fontWeight: '500',
      display: 'block',
      marginBottom: '0.5rem'
    },
    buttonContainer: {
      textAlign: 'center',
      marginBottom: '2rem',
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
      flexWrap: 'wrap'
    },
    btn: {
      padding: '0.75rem 1.5rem',
      backgroundColor: '#f9ac54',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      fontFamily: 'Poppins, sans-serif'
    },
    btnSecondary: {
      backgroundColor: '#2196f3'
    },
    btnCancel: {
      backgroundColor: '#6b7280'
    },
    btnShowMore: {
      backgroundColor: '#8b5cf6',
      marginTop: '1rem',
      width: '100%'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      fontFamily: 'Poppins, sans-serif'
    },
    modalContent: {
      backgroundColor: 'rgba(31, 33, 37, 0.95)',
      padding: '2rem',
      borderRadius: '12px',
      width: '90%',
      maxWidth: '600px',
      maxHeight: '80vh',
      overflowY: 'auto',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      backdropFilter: 'blur(10px)',
      position: 'relative',
      zIndex: 1001
    },
    modalTitle: {
      color: '#f9ac54',
      fontSize: '1.5rem',
      fontWeight: '600',
      marginBottom: '1.5rem',
      textAlign: 'center'
    },
    textarea: {
      width: '100%',
      padding: '1rem',
      borderRadius: '8px',
      border: '2px solid #35373b',
      backgroundColor: '#1f2125',
      color: '#ffffff',
      fontSize: '1rem',
      outline: 'none',
      transition: 'border-color 0.3s ease',
      fontFamily: 'Poppins, sans-serif',
      resize: 'vertical',
      minHeight: '120px'
    },
    feedbackCard: {
      backgroundColor: 'rgba(17, 19, 23, 0.8)',
      borderRadius: '8px',
      padding: '1.5rem',
      marginBottom: '1rem',
      border: '1px solid #35373b',
      position: 'relative',
      overflow: 'visible'
    },
    feedbackMeta: {
      marginBottom: '0.5rem',
      color: '#d1d5db',
      fontSize: '0.9rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      flexWrap: 'wrap'
    },
    feedbackText: {
      color: '#ffffff',
      lineHeight: '1.6',
      marginTop: '0.5rem'
    },
    actionButtons: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      display: 'flex',
      gap: '0.5rem',
      zIndex: 10
    },
    actionBtn: {
      padding: '0.25rem 0.75rem',
      border: 'none',
      borderRadius: '4px',
      fontSize: '0.875rem',
      cursor: 'pointer',
      fontWeight: '500',
      zIndex: 11,
      position: 'relative'
    },
    editBtn: {
      backgroundColor: '#2196f3',
      color: '#ffffff'
    },
    deleteBtn: {
      backgroundColor: '#ef4444',
      color: '#ffffff'
    }
  };

  if (loading) {
    return (
      <div style={pageStyles.pageWrapper}>
        <MemberNavbar />
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh'
        }}>
          <Loading message="Đang xử lý..." />
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyles.pageWrapper}>
      <MemberNavbar />
      <div style={pageStyles.contentWrapper}>
        <div style={pageStyles.profileBox}>
          <h2 style={pageStyles.title}>Góp ý - Feedback</h2>
          
          {success && <div style={pageStyles.successMessage}>{success}</div>}
          {error && <div style={pageStyles.errorMessage}>{error}</div>}

          {/* Nút thêm feedback và danh sách feedback đã gửi */}
          <div style={pageStyles.buttonContainer}>
            <button 
              style={pageStyles.btn}
              onClick={() => {
                setError('');
                setSuccess('');
                setShowAddModal(true);
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#d79447'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#f9ac54'}
            >
              Thêm feedback mới
            </button>
            <button
              style={{ ...pageStyles.btn, ...pageStyles.btnSecondary }}
              onClick={() => {
                setError('');
                setSuccess('');
                fetchMyFeedbacks();
                setShowMyFeedbacks(true);
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#1976d2'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#2196f3'}
            >
              Feedback của tôi
            </button>
          </div>

          {/* Modal danh sách feedback đã gửi */}
          {showMyFeedbacks && (
            <div style={pageStyles.modal} onClick={() => {
              setShowMyFeedbacks(false);
              setError('');
              setSuccess('');
              setEditingId(null);
              setEditingText('');
              setEditingRating(0);
            }}>
              <div style={pageStyles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h3 style={pageStyles.modalTitle}>Feedback của tôi</h3>
                <button
                  style={{ ...pageStyles.btn, ...pageStyles.btnCancel, marginBottom: '1rem' }}
                  onClick={() => {
                    setShowMyFeedbacks(false);
                    setError('');
                    setSuccess('');
                    setEditingId(null);
                    setEditingText('');
                    setEditingRating(0);
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#545456'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#6b7280'}
                >
                  Đóng
                </button>
                {myFeedbacks.length === 0 ? (
                  <div style={{ color: '#d1d5db', textAlign: 'center', padding: '2rem' }}>
                    Bạn chưa gửi feedback nào.
                  </div>
                ) : (
                  myFeedbacks.map((fb, index) => (
                    <div key={fb.feedbackId || `modal-feedback-${index}`} style={pageStyles.feedbackCard}>
                      <div style={pageStyles.feedbackMeta}>
                        <span><strong>Ngày gửi:</strong> {fb.feedbackDate}</span>
                        <StarRating rating={fb.rating || 5} readonly size={16} />
                      </div>
                      <div style={pageStyles.feedbackText}>
                        <strong>Nội dung:</strong>
                        {editingId === fb.feedbackId ? (
                          <div>
                            <textarea
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              style={{ 
                                ...pageStyles.textarea, 
                                marginTop: '0.5rem',
                                minHeight: '80px'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#f9ac54'}
                              onBlur={(e) => e.target.style.borderColor = '#35373b'}
                            />
                            <div style={pageStyles.formGroup}>
                              <label style={pageStyles.label}>Đánh giá:</label>
                              <StarRating 
                                rating={editingRating} 
                                onRatingChange={setEditingRating} 
                                size={20}
                              />
                            </div>
                            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                              <button
                                style={pageStyles.btn}
                                onClick={() => handleSaveEdit(fb.feedbackId)}
                                disabled={loading}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#d79447'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#f9ac54'}
                              >
                                {loading ? 'Đang lưu...' : 'Lưu'}
                              </button>
                              <button
                                style={{ ...pageStyles.btn, ...pageStyles.btnCancel }}
                                onClick={handleCancelEdit}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#545456'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#6b7280'}
                              >
                                Hủy
                              </button>
                            </div>
                          </div>
                        ) : (
                          <span style={{ marginLeft: '0.5rem' }}>{fb.feedbackText}</span>
                        )}
                      </div>
                      {editingId !== fb.feedbackId && (
                        <div style={pageStyles.actionButtons}>
                          <button
                            style={{ ...pageStyles.actionBtn, ...pageStyles.editBtn }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleEdit(fb);
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#1976d2'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#2196f3'}
                            disabled={loading}
                          >
                            Sửa
                          </button>
                          <button
                            style={{ ...pageStyles.actionBtn, ...pageStyles.deleteBtn }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDelete(fb.feedbackId);
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#d32f2f'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
                            disabled={loading}
                          >
                            Xóa
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Modal thêm feedback */}
          {showAddModal && (
            <div style={pageStyles.modal} onClick={() => {
              setShowAddModal(false);
              setError('');
              setSuccess('');
              setFeedbackText('');
              setRating(0);
            }}>
              <div style={{ ...pageStyles.modalContent, maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
                <h3 style={pageStyles.modalTitle}>Thêm feedback mới</h3>
                <form onSubmit={handleSubmit}>
                  <div style={pageStyles.formGroup}>
                    <label style={pageStyles.label}>Nội dung feedback:</label>
                    <textarea
                      style={pageStyles.textarea}
                      placeholder="Nhập nội dung góp ý của bạn..."
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      onFocus={(e) => e.target.style.borderColor = '#f9ac54'}
                      onBlur={(e) => e.target.style.borderColor = '#35373b'}
                    />
                  </div>
                  <div style={pageStyles.formGroup}>
                    <label style={pageStyles.label}>Đánh giá:</label>
                    <StarRating rating={rating} onRatingChange={setRating} size={24} />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button 
                      type="button"
                      style={{ ...pageStyles.btn, ...pageStyles.btnCancel }}
                      onClick={() => {
                        setShowAddModal(false);
                        setError('');
                        setSuccess('');
                        setFeedbackText('');
                        setRating(0);
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#545456'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#6b7280'}
                    >
                      Hủy
                    </button>
                    <button 
                      style={pageStyles.btn}
                      type="submit"
                      disabled={loading}
                      onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#d79447')}
                      onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#f9ac54')}
                    >
                      {loading ? 'Đang gửi...' : 'Gửi feedback'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Danh sách tất cả feedback */}
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ 
              ...pageStyles.title, 
              fontSize: '1.5rem', 
              marginBottom: '1.5rem' 
            }}>
              {showAllFeedbacks ? 'Tất cả feedback' : '5 feedback mới nhất'}
            </h3>
            {displayedFeedbacks.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                color: '#d1d5db', 
                padding: '2rem',
                backgroundColor: 'rgba(17, 19, 23, 0.5)',
                borderRadius: '8px'
              }}>
                Chưa có feedback nào.
              </div>
            ) : (
              <>
                {displayedFeedbacks.map((fb, index) => (
                  <div key={fb.feedbackId || `main-feedback-${index}`} style={pageStyles.feedbackCard}>
                    <div style={pageStyles.feedbackMeta}>
                      <span><strong>Người gửi:</strong> {fb.userName}</span>
                      <span><strong>Ngày gửi:</strong> {fb.feedbackDate}</span>
                      <StarRating rating={fb.rating || 5} readonly size={16} />
                    </div>
                    <div style={pageStyles.feedbackText}>
                      <strong>Nội dung:</strong>
                      {editingId === fb.feedbackId ? (
                        <div>
                          <textarea
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            style={{ 
                              ...pageStyles.textarea, 
                              marginTop: '0.5rem',
                              minHeight: '80px'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#f9ac54'}
                            onBlur={(e) => e.target.style.borderColor = '#35373b'}
                          />
                          <div style={pageStyles.formGroup}>
                            <label style={pageStyles.label}>Đánh giá:</label>
                            <StarRating 
                              rating={editingRating} 
                              onRatingChange={setEditingRating} 
                              size={20}
                            />
                          </div>
                          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                            <button
                              style={pageStyles.btn}
                              onClick={() => handleSaveEdit(fb.feedbackId)}
                              disabled={loading}
                              onMouseOver={(e) => e.target.style.backgroundColor = '#d79447'}
                              onMouseOut={(e) => e.target.style.backgroundColor = '#f9ac54'}
                            >
                              {loading ? 'Đang lưu...' : 'Lưu'}
                            </button>
                            <button
                              style={{ ...pageStyles.btn, ...pageStyles.btnCancel }}
                              onClick={handleCancelEdit}
                              onMouseOver={(e) => e.target.style.backgroundColor = '#545456'}
                              onMouseOut={(e) => e.target.style.backgroundColor = '#6b7280'}
                            >
                              Hủy
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span style={{ marginLeft: '0.5rem' }}>{fb.feedbackText}</span>
                      )}
                    </div>
                    {editingId !== fb.feedbackId && user_id && fb.userName === user?.user_name && (
                      <div style={pageStyles.actionButtons}>
                        <button
                          style={{ ...pageStyles.actionBtn, ...pageStyles.editBtn }}
                          onClick={() => handleEdit(fb)}
                          onMouseOver={(e) => e.target.style.backgroundColor = '#1976d2'}
                          onMouseOut={(e) => e.target.style.backgroundColor = '#2196f3'}
                          disabled={loading}
                        >
                          Sửa
                        </button>
                        <button
                          style={{ ...pageStyles.actionBtn, ...pageStyles.deleteBtn }}
                          onClick={() => handleDelete(fb.feedbackId)}
                          onMouseOver={(e) => e.target.style.backgroundColor = '#d32f2f'}
                          onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
                          disabled={loading}
                        >
                          Xóa
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Nút hiển thị thêm feedback */}
                {!showAllFeedbacks && allFeedbacks.length > 5 && (
                  <div style={{ textAlign: 'center' }}>
                    <button
                      style={{ ...pageStyles.btn, ...pageStyles.btnShowMore }}
                      onClick={handleShowAllFeedbacks}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#7c3aed'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#8b5cf6'}
                    >
                      Hiển thị tất cả feedback ({allFeedbacks.length - 5} feedback khác)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;