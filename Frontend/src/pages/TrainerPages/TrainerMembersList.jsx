import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TrainerMembersList.css';

function TrainerMembersList() {
  const [members, setMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [attendances, setAttendances] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));
  const trainerId = user?.user_id;

  // Hàm tính lại ptMeetingDaysLeft và ptMeetingDaysUsed cho từng attendance
function computePtSessions(attendances) {
  if (!attendances.length) return [];

  // Sort theo checkinDate
  const sorted = [...attendances].sort((a, b) => new Date(a.checkinDate) - new Date(b.checkinDate));

  // Lấy ptMeetingDaysLeft ban đầu từ buổi đầu tiên
  const initialPtLeft = sorted[0].ptMeetingDaysLeft ?? 0;

  let ptUsedCount = 0;

  return sorted.map((att) => {
    // Nếu attendance có feedback (khác null và khác rỗng) thì tính là đã dùng 1 buổi PT
    if (att.feedback && att.feedback.trim() !== '') {
      ptUsedCount++;
    }

    const ptLeft = initialPtLeft - ptUsedCount;
    return {
      ...att,
      ptMeetingDaysLeft: ptLeft < 0 ? 0 : ptLeft,
      ptMeetingDaysUsed: ptUsedCount,
    };
  });
}


  useEffect(() => {
    if (!trainerId) return;
    axios
      .get(`http://localhost:8080/api/trainer/members?trainerId=${trainerId}`)
      .then((res) => setMembers(res.data))
      .catch((err) => console.error(err));
  }, [trainerId]);

  useEffect(() => {
    if (!selectedMemberId) return;
    axios
      .get(`http://localhost:8080/api/trainer/members/${selectedMemberId}/attendances`)
      .then((res) => {
        const computed = computePtSessions(res.data);
        setAttendances(computed);
      })
      .catch((err) => console.error(err));
  }, [selectedMemberId]);

  const handleCreateAttendance = (memberId) => {
    axios
      .post(`http://localhost:8080/api/trainer/members/${memberId}/attendances`)
      .then((res) => {
        // Thêm attendance mới rồi tính lại
        const newAttendances = [...attendances, res.data];
        const computed = computePtSessions(newAttendances);
        setAttendances(computed);
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.userId}>
              <td>{m.userId}</td>
              <td>{m.fullname}</td>
              <td>{m.packageName}</td>
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
                <th>PT Days Left</th>
                <th>PT Days Used</th>
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
                  <td>{att.ptMeetingDaysLeft}</td>
                  <td>{att.ptMeetingDaysUsed}</td>
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
                <td colSpan={5}>
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
