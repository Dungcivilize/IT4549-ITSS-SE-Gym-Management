import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MembershipApproval.css'; // Import CSS

const MembershipApproval = () => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [approvingId, setApprovingId] = useState(null);

  const fetchPendingMemberships = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/receptionist/pending');
      setMemberships(response.data);
    } catch (error) {
      console.error('Error fetching memberships:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveMembership = async (membershipId) => {
    setApprovingId(membershipId);
    try {
      await axios.put(`http://localhost:8080/api/receptionist/approve/${membershipId}`);
      await fetchPendingMemberships();
    } catch (error) {
      console.error('Error approving membership:', error);
    } finally {
      setApprovingId(null);
    }
  };

  useEffect(() => {
    fetchPendingMemberships();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="membership-approval-container">
      <h2 className="membership-approval-title">Yêu cầu đăng ký gói tập</h2>

      {loading ? (
        <p className="membership-approval-info-text">Đang tải...</p>
      ) : memberships.length === 0 ? (
        <p className="membership-approval-info-text">Không có yêu cầu nào đang chờ duyệt.</p>
      ) : (
        <div className="membership-approval-table-wrapper">
          <table className="membership-approval-table">
            <thead>
              <tr>
                <th>Tên hội viên</th>
                <th>Gói tập</th>
                <th>Ngày bắt đầu</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {memberships.map((m) => (
                <tr key={m.membershipId} className="membership-approval-table-row">
                  <td>{m.memberName}</td>
                  <td>{m.packageName}</td>
                  <td>{formatDate(m.startDate)}</td>
                  <td>{m.status}</td>
                  <td>
                    <button
                      disabled={approvingId === m.membershipId}
                      onClick={() => approveMembership(m.membershipId)}
                      className={`membership-approval-approve-btn ${approvingId === m.membershipId ? "disabled" : ""}`}
                    >
                      {approvingId === m.membershipId ? 'Đang duyệt...' : 'Duyệt'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MembershipApproval;
