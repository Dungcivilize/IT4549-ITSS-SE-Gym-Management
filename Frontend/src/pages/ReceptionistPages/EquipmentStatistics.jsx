import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";
import "./EquipmentStatistics.css";

const EquipmentStatistics = () => {
  const [data, setData] = useState([]);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [notesInput, setNotesInput] = useState("");
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const modalRef = useRef(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/receptionist/equipment-statistics")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.error("Lỗi khi load thiết bị:", err));
  }, []);

  useEffect(() => {
    if (editingEquipment && modalRef.current) {
      modalRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [editingEquipment]);

  const groupedByRoom = data.reduce((acc, curr) => {
    const { roomName } = curr;
    if (!acc[roomName]) acc[roomName] = [];
    acc[roomName].push(curr);
    return acc;
  }, {});

  const handleSave = () => {
    axios
      .put(
        `http://localhost:8080/api/receptionist/equipment/update-notes-status`,
        {
          equipmentId: editingEquipment.equipmentId,
          notes: notesInput,
          status: "Unavailable",
        }
      )
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
      case "Available":
        return "#10B981";
      case "Unavailable":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  return (
    <TooltipProvider>
      <div className="eqs-container">
        <h2 className="eqs-title">Thống kê thiết bị theo phòng</h2>
        <div className="eqs-grid-container">
          {Object.entries(groupedByRoom).map(([roomName, equipments]) => (
            <div key={roomName} className="eqs-card">
              <div>
                <h3 className="eqs-room-title">{roomName}</h3>
                <table className="eqs-equipment-table">
                  <thead>
                    <tr>
                      <th>Tên thiết bị</th>
                      <th className="eqs-text-center">Trạng thái</th>
                      <th className="eqs-text-center">Số lượng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {equipments.map((eq, idx) => (
                      <tr
                        key={`${eq.id}-${idx}`}
                        className="eqs-equipment-row"
                        onClick={(e) => {
                          setEditingEquipment(eq);
                          setNotesInput(eq.notes || "");

                          const rect = e.currentTarget.getBoundingClientRect();
                          setModalPosition({
                            top: rect.bottom + window.scrollY + 8,
                            left: rect.left + window.scrollX,
                          });
                        }}
                      >
                        <td className="eqs-equipment-name">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div>{eq.equipmentName}</div>
                            </TooltipTrigger>
                            {eq.notes && (
                              <TooltipContent className="eqs-tooltip-content">
                                Ghi chú: {eq.notes}
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </td>
                        <td className="eqs-text-center">
                          <span
                            className="eqs-status-badge"
                            style={{ backgroundColor: getStatusColor(eq.status) }}
                          >
                            {eq.status}
                          </span>
                        </td>
                        <td className="eqs-text-center">{eq.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {editingEquipment && (
          <div
            className="eqs-modal-overlay"
            onClick={() => setEditingEquipment(null)}
          >
            <div
              ref={modalRef}
              className="eqs-modal-content"
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "fixed",
                top: (() => {
                  const viewportHeight = window.innerHeight;
                  const modalHeight = 300;
                  const calculatedTop = modalPosition.top - window.scrollY;
                  if (calculatedTop + modalHeight > viewportHeight) {
                    return viewportHeight - modalHeight - 16;
                  }
                  return calculatedTop;
                })(),
                left: "50%",
                transform: "translateX(-50%)",
                minWidth: 300,
                maxWidth: 400,
                maxHeight: "80vh",
                overflowY: "auto",
                zIndex: 1100,
              }}
            >
              <h3 className="eqs-modal-title">
                Ghi chú thiết bị: {editingEquipment.equipmentName}
              </h3>
              <p className="eqs-modal-subtitle">
                Phòng: {editingEquipment.roomName}
              </p>
              <textarea
                className="eqs-notes-textarea"
                rows={4}
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder="Nhập ghi chú..."
              />
              <div className="eqs-modal-actions">
                <button
                  className="eqs-cancel-button"
                  onClick={() => setEditingEquipment(null)}
                >
                  Hủy
                </button>
                <button className="eqs-save-button" onClick={handleSave}>
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
