import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MembershipApproval.css';

const MembershipApproval = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  const fetchPendingPayments = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/receptionist/pending-payments');
      setPayments(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách thanh toán chờ duyệt:', error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (action) => {
    if (!selectedPayment) return;
    
    if (action === 'REJECT' && !rejectReason.trim()) {
      alert('Vui lòng nhập lý do từ chối thanh toán!');
      return;
    }

    setProcessingId(selectedPayment.membershipId);
    try {
      const payload = {
        membershipId: selectedPayment.membershipId,
        action: action,
        reason: action === 'REJECT' ? rejectReason.trim() : null
      };

      await axios.post('http://localhost:8080/api/receptionist/verify-payment', payload);
      
      const actionText = action === 'APPROVE' ? 'duyệt' : 'từ chối';
      alert(`Đã ${actionText} thanh toán thành công!`);
      
      setShowVerifyModal(false);
      setSelectedPayment(null);
      setRejectReason('');
      
      await fetchPendingPayments();
    } catch (error) {
      console.error('Lỗi khi xử lý thanh toán:', error);
      const errorMessage = error.response?.data || error.message || 'Lỗi không xác định';
      alert('Lỗi: ' + errorMessage);
    } finally {
      setProcessingId(null);
    }
  };

  const openVerifyModal = (payment, event) => {
    const buttonRect = event.target.getBoundingClientRect();
    const modalWidth = 450;
    const modalHeight = 600;
    
    // Tính toán vị trí modal
    let left = buttonRect.right + 15; // 15px cách button để có chỗ cho mũi tên
    let top = buttonRect.top;
    let arrowSide = 'left'; // Mũi tên ở bên trái modal
    
    // Kiểm tra nếu modal bị tràn ra ngoài màn hình bên phải
    if (left + modalWidth > window.innerWidth) {
      left = buttonRect.left - modalWidth - 15; // Hiển thị bên trái button
      arrowSide = 'right'; // Mũi tên ở bên phải modal
    }
    
    // Kiểm tra nếu modal bị tràn ra ngoài màn hình phía dưới
    if (top + modalHeight > window.innerHeight) {
      top = window.innerHeight - modalHeight - 20;
    }
    
    // Đảm bảo modal không bị tràn lên trên
    if (top < 20) {
      top = 20;
    }
    
    setModalPosition({ top, left, arrowSide });
    setSelectedPayment(payment);
    setRejectReason('');
    setShowVerifyModal(true);
  };

  const closeVerifyModal = () => {
    setShowVerifyModal(false);
    setSelectedPayment(null);
    setRejectReason('');
  };

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateOnly = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="membership-approval-container">
      <h2 className="membership-approval-title">Xác nhận thanh toán gói tập</h2>
      <p style={{ color: '#b5b5b5', marginBottom: '20px', textAlign: 'center' }}>
        Danh sách các gói tập đã thanh toán và đang chờ xác nhận mã giao dịch
      </p>

      {loading ? (
        <p className="membership-approval-info-text">Đang tải...</p>
      ) : payments.length === 0 ? (
        <p className="membership-approval-info-text">Không có thanh toán nào đang chờ xác nhận.</p>
      ) : (
        <div className="membership-approval-table-wrapper">
          <table className="membership-approval-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên hội viên</th>
                <th>Gói tập</th>
                <th>Số tiền</th>
                <th>Ngày bắt đầu</th>
                <th>Ngày kết thúc</th>
                <th>Mã giao dịch</th>
                <th>Ngày thanh toán</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.membershipId} className="membership-approval-table-row">
                  <td>#{payment.membershipId}</td>
                  <td>{payment.memberName}</td>
                  <td>{payment.packageName}</td>
                  <td className="amount-cell">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td>{formatDateOnly(payment.startDate)}</td>
                  <td>{formatDateOnly(payment.endDate)}</td>
                  <td className="transaction-code">
                    {payment.transactionCode || 'N/A'}
                  </td>
                  <td>{formatDate(payment.paymentDate)}</td>
                  <td>
                    <button
                      disabled={processingId === payment.membershipId}
                      onClick={(e) => openVerifyModal(payment, e)}
                      className={`membership-approval-approve-btn ${processingId === payment.membershipId ? "disabled" : ""}`}
                    >
                      {processingId === payment.membershipId ? 'Đang xử lý...' : 'Xác nhận'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showVerifyModal && selectedPayment && (
        <div className="modal-overlay" onClick={closeVerifyModal}>
          <div 
            className={`modal-content modal-popup ${modalPosition.arrowSide ? `arrow-${modalPosition.arrowSide}` : ''}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: `${modalPosition.top}px`,
              left: `${modalPosition.left}px`,
              right: 'auto',
              height: 'auto',
              maxHeight: '80vh',
              width: '450px',
              transform: 'none',
              animation: 'popupScale 0.2s ease-out'
            }}
          >
            <div className="modal-header">
              <h3 className="modal-title">
                Xác nhận thanh toán gói tập
              </h3>
              <button className="close-btn" onClick={closeVerifyModal}>&times;</button>
            </div>
            
            <div className="modal-body">
              <div className="payment-details">
                <div className="details-grid">
                  <div className="detail-item">
                    <strong>Membership ID:</strong> #{selectedPayment.membershipId}
                  </div>
                  <div className="detail-item">
                    <strong>Member ID:</strong> #{selectedPayment.memberId}
                  </div>
                  <div className="detail-item">
                    <strong>Hội viên:</strong> {selectedPayment.memberName}
                  </div>
                  <div className="detail-item">
                    <strong>Gói tập:</strong> {selectedPayment.packageName}
                  </div>
                  <div className="detail-item">
                    <strong>Số tiền:</strong> {formatCurrency(selectedPayment.amount)}
                  </div>
                  <div className="detail-item">
                    <strong>Ngày bắt đầu:</strong> {formatDateOnly(selectedPayment.startDate)}
                  </div>
                  <div className="detail-item">
                    <strong>Ngày kết thúc:</strong> {formatDateOnly(selectedPayment.endDate)}
                  </div>
                  <div className="detail-item">
                    <strong>Ngày thanh toán:</strong> {formatDate(selectedPayment.paymentDate)}
                  </div>
                </div>
                
                <div className="transaction-info">
                  <strong>Mã giao dịch:</strong> 
                  <span className="transaction-code-display">
                    {selectedPayment.transactionCode || 'Chưa có'}
                  </span>
                </div>
              </div>

              <div className="reject-reason-section">
                <label className="reject-label">
                  Lý do từ chối (nếu có):
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Nhập lý do từ chối thanh toán (ví dụ: Mã giao dịch không hợp lệ, Số tiền không đúng...)"
                  className="reject-textarea"
                />
                <small className="reject-note">
                  * Bắt buộc khi từ chối thanh toán
                </small>
              </div>
            </div>

            <div className="modal-footer">
              <div className="modal-actions">
                <button
                  onClick={closeVerifyModal}
                  className="btn-cancel"
                >
                  Hủy
                </button>
                
                <button
                  onClick={() => handleVerifyPayment('REJECT')}
                  disabled={processingId === selectedPayment.membershipId || !rejectReason.trim()}
                  className={`btn-reject ${(!rejectReason.trim() || processingId === selectedPayment.membershipId) ? 'disabled' : ''}`}
                >
                  {processingId === selectedPayment.membershipId ? 'Đang xử lý...' : 'Từ chối'}
                </button>
                
                <button
                  onClick={() => handleVerifyPayment('APPROVE')}
                  disabled={processingId === selectedPayment.membershipId}
                  className={`btn-approve ${processingId === selectedPayment.membershipId ? 'disabled' : ''}`}
                >
                  {processingId === selectedPayment.membershipId ? 'Đang xử lý...' : 'Duyệt'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipApproval;
