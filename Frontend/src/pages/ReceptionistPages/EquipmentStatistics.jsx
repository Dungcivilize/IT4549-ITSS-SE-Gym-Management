import React, { useEffect, useState } from "react";
import axios from "axios";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@radix-ui/react-tooltip';
import "./EquipmentStatistics.css"; 

const EquipmentStatistics = () => {
  const [data, setData] = useState([]);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [notesInput, setNotesInput] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/receptionist/equipment-statistics")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.error("Lỗi khi load thiết bị:", err));
  }, []);

  const groupedByRoom = data.reduce((acc, curr) => {
    const { roomName } = curr;
    if (!acc[roomName]) acc[roomName] = [];
    acc[roomName].push(curr);
    return acc;
  }, {});

  const handleSave = () => {
    axios
      .put(`http://localhost:8080/api/receptionist/equipment/update-notes-status`, {
        equipmentId: editingEquipment.equipmentId,
        notes: notesInput,
        status: "Unavailable",
      })
      .then(() => {
        setData((prev) =>
          prev.map((eq) =>
            eq.equipmentId === editingEquipment.equipmentId
              ? { ...eq, notes: notesInput, status: "Unavailable" }
              : eq
          )
        );
        setEditingEquipment(null);
      })
      .catch((err) => {
        console.error("Lỗi cập nhật thiết bị:", err);
      });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return '#10B981';
      case 'Unavailable': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <TooltipProvider>
      <div className="container">
        <h2 className="title">Thống kê thiết bị theo phòng</h2>
        <div className="grid-container">
          {Object.entries(groupedByRoom).map(([roomName, equipments]) => (
            <div key={roomName} className="card">
              <div>
                <h3 className="room-title">{roomName}</h3>
                <table className="equipment-table">
                  <thead>
                    <tr>
                      <th>Tên thiết bị</th>
                      <th className="text-center">Trạng thái</th>
                      <th className="text-center">Số lượng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {equipments.map((eq, idx) => (
                      <tr
                        key={`${eq.id}-${idx}`}
                        className="equipment-row"
                        onClick={() => {
                          setEditingEquipment(eq);
                          setNotesInput(eq.notes || "");
                        }}
                      >
                        <td className="equipment-name">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div>{eq.equipmentName}</div>
                            </TooltipTrigger>
                            {eq.notes && (
                              <TooltipContent className="tooltip-content">
                                Ghi chú: {eq.notes}
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </td>
                        <td className="text-center">
                          <span 
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(eq.status) }}
                          >
                            {eq.status}
                          </span>
                        </td>
                        <td className="text-center">{eq.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {editingEquipment && (
          <div className="modal-overlay" onClick={() => setEditingEquipment(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3 className="modal-title">
                Ghi chú thiết bị: {editingEquipment.equipmentName}
              </h3>
              <p className="modal-subtitle">
                Phòng: {editingEquipment.roomName}
              </p>
              <textarea
                className="notes-textarea"
                rows={4}
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder="Nhập ghi chú..."
              />
              <div className="modal-actions">
                <button
                  className="cancel-button"
                  onClick={() => setEditingEquipment(null)}
                >
                  Hủy
                </button>
                <button
                  className="save-button"
                  onClick={handleSave}
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default EquipmentStatistics;