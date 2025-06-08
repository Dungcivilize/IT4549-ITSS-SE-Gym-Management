import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TrainerMembersList.css';

function TrainerMembersList() {
  const [members, setMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [ptDaysLeft, setPtDaysLeft] = useState(null);
  const [attendances, setAttendances] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));
  const trainerId = user?.user_id;

  // Hàm đơn giản chỉ để sort attendances
  function sortAttendances(attendances) {
    if (!attendances.length) return [];
    return [...attendances].sort((a, b) => new Date(a.checkinDate) - new Date(b.checkinDate));
  }

  useEffect(() => {
  const fetchMembersWithPTDays = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/trainer/members?trainerId=${trainerId}`);
      const memberList = res.data;

      const updatedMembers = await Promise.all(
        memberList.map(async (member) => {
          try {
            const membershipRes = await axios.get(`http://localhost:8080/api/memberships/current/${member.userId}`);
            return {
              ...member,
              ptMeetingDaysLeft: membershipRes.data.ptMeetingDaysLeft || 'N/A',
            };
          } catch (error) {
            console.error(`Lỗi khi lấy PT days của member ${member.userId}:`, error);
            return { ...member, ptMeetingDaysLeft: 'N/A' };
          }
        })
      );

      setMembers(updatedMembers);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách members:', err);
    }
  };

  if (trainerId) {
    fetchMembersWithPTDays();
  }
}, [trainerId]);


  const handleCreateAttendance = (memberId) => {
    axios
      .post(`http://localhost:8080/api/trainer/members/${memberId}/attendances`)
      .then((res) => {
        // Thêm attendance mới rồi sort lại
        const newAttendances = [...attendances, res.data];
        const sorted = sortAttendances(newAttendances);
        setAttendances(sorted);
      })
      .catch((err) => console.error(err));
  };

  const handleUpdateFeedback = (attendanceId, feedback) => {
    axios
      .put(`http://localhost:8080/api/trainer/attendance/${attendanceId}/feedback`, { feedback })
      .then(() => {
        setSuccessMessage('Cập nhật feedback thành công!');
        setTimeout(() => setSuccessMessage(''), 3000); // 3 giây tự ẩn thông báo
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="trainer-members-container">
      <h2 className="trainer-members-title">Danh sách Hội viên</h2>
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
      <table className="trainer-members-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Full Name</th>
            <th>Package Name</th>
            <th>PT Days Left</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.userId}>
              <td>{m.userId}</td>
              <td>{m.fullname}</td>
              <td>{m.packageName}</td>
              <td>{m.ptMeetingDaysLeft !== undefined ? m.ptMeetingDaysLeft : 'N/A'}</td>
              <td>
                <button
                  className="trainer-members-button"
                  onClick={() => setSelectedMemberId(m.userId)}
                >
                  Xem điểm danh
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedMemberId && (
        <div>
          <h3 className="trainer-members-subtitle">
            Điểm danh hội viên: {members.find(m => m.userId === selectedMemberId)?.fullname || 'Không xác định'}
          </h3>
          <table className="trainer-members-table">
            <thead>
              <tr>
                <th>Check-in Date</th>
                <th>Feedback</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendances.map((att, index) => (
                <tr key={att.attendanceId}>
                  <td>{new Date(att.checkinDate).toLocaleString()}</td>
                  <td>
                    <input
                      type="text"
                      className="trainer-feedback-input"
                      value={att.feedback || ''}
                      onChange={(e) => {
                        const updated = [...attendances];
                        updated[index].feedback = e.target.value;
                        setAttendances(updated);
                      }}
                    />
                  </td>
                  <td>
                    <button
                      className="trainer-update-button"
                      onClick={() => handleUpdateFeedback(att.attendanceId, att.feedback)}
                    >
                      Cập nhật
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={3}>
                  <button
                    className="trainer-members-button"
                    onClick={() => handleCreateAttendance(selectedMemberId)}
                  >
                    Thêm checkin mới
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TrainerMembersList;