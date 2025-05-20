import GymRoomList from '../component/GymRoomList';

function OwnerDashboard() {
  return (
    <div className="container">
      <h1>Chào mừng Chủ Phòng Tập</h1>
      <GymRoomList />
      {/* Sau này có thể thêm các mục quản lý khác tại đây */}
    </div>
  );
}

export default OwnerDashboard;
