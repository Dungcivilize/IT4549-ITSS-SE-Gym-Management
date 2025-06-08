import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PackageManagement.css';

export default function PackageManagement() {
  const [packages, setPackages] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [formData, setFormData] = useState({
    packageName: '',
    duration: '',
    maxPtMeetingDays: '',
    price: '',
    discount: 0,
    pt: false,
    trainerIds: []
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchPackages();
    fetchTrainers();
  }, []);

  const fetchPackages = async () => {
    const res = await axios.get('http://localhost:8080/api/membership-packages');
    setPackages(res.data);
  };

  const fetchTrainers = async () => {
    const res = await axios.get('http://localhost:8080/api/users');
    const trainerList = res.data.filter(user => user.role === 'trainer');
    setTrainers(trainerList);
  };

  const handleChange = e => {
    const { name, checked } = e.target;

    if (name === 'pt' && checked === false && formData.trainerIds.length > 0) {
      if (window.confirm("Bạn có chắc chắn muốn tắt PT? Các trainer liên kết sẽ bị xóa.")) {
        setFormData({
          ...formData,
          pt: false,
          trainerIds: [],
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: e.target.type === 'checkbox' ? checked : e.target.value,
      });
    }
  };

  const handleTrainerSelect = e => {
    const id = Number(e.target.value);
    if (id && !formData.trainerIds.includes(id)) {
      setFormData({ ...formData, trainerIds: [...formData.trainerIds, id] });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`http://localhost:8080/api/membership-packages/${editingId}`, formData);
    } else {
      await axios.post('http://localhost:8080/api/membership-packages', formData);
    }

    setFormData({ packageName: '', duration: '', price: '', maxPtMeetingDays: '', discount: 0, pt: false, trainerIds: [] });
    setEditingId(null);
    fetchPackages();
  };

  const handleEdit = pkg => {
    setFormData({
      packageName: pkg.packageName,
      duration: pkg.duration,
      price: pkg.price,
      maxPtMeetingDays: pkg.maxPtMeetingDays,
      discount: pkg.discount,
      pt: pkg.pt,
      trainerIds: pkg.trainerIds,
    });
    setEditingId(pkg.packageId);
  };

  const handleDelete = async id => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa gói này?')) return;
    await axios.delete(`http://localhost:8080/api/membership-packages/${id}`);
    fetchPackages();
  };

  const handleCancel = () => {
    setFormData({ packageName: '', duration: '', price: '', maxPtMeetingDays: '', discount: 0, pt: false, trainerIds: [] });
    setEditingId(null);
  };

  const removeTrainer = (trainerId) => {
    setFormData({
      ...formData,
      trainerIds: formData.trainerIds.filter(tid => tid !== trainerId),
    });
  };

  return (
    <div className="package-management">
      <div className="package-container">
        <h2 className="package-title">Package Management</h2>
        
        <form onSubmit={handleSubmit} className="package-form">
          <div className="form-grid">
            <input 
              className="form-input" 
              name="packageName" 
              placeholder="Package Name" 
              value={formData.packageName} 
              onChange={handleChange} 
              required 
            />
            <input 
              className="form-input" 
              name="duration" 
              placeholder="Duration (days)" 
              type="number" 
              value={formData.duration} 
              onChange={handleChange} 
              required 
            />
            <input 
              className="form-input" 
              name="price" 
              placeholder="Price" 
              type="number" 
              value={formData.price} 
              onChange={handleChange} 
              required 
            />
            <input 
              className="form-input" 
              name="discount" 
              step={0.01}
              min={0} 
              type="number"
              placeholder="Discount (%)" 
              value={formData.discount} 
              onChange={handleChange} 
              required
            />
            {formData.pt && (
              <input 
                className="form-input" 
                name="maxPtMeetingDays" 
                placeholder="Max PT Meeting Days" 
                type="number" 
                value={formData.maxPtMeetingDays} 
                onChange={handleChange} 
                required 
              />
            )}
          </div>

          <label className="checkbox-label">
            <input
              className="checkbox-input"
              type="checkbox"
              name="pt"
              checked={formData.pt}
              onChange={handleChange}
            />
            Personal Trainer (PT)
          </label>

          {formData.pt && (
            <div className="trainer-section">
              <div className="trainer-section-label">Choose Trainers:</div>
              <select className="trainer-select" onChange={handleTrainerSelect}>
                <option value="">-- Select Trainer --</option>
                {trainers
                  .filter(t => !formData.trainerIds.includes(t.id))
                  .map(t => (
                    <option key={t.id} value={t.id}>
                      {t.fullname}
                    </option>
                  ))}
              </select>
              <div className="trainer-tags">
                {formData.trainerIds.map(id => {
                  const trainer = trainers.find(t => t.id === id);
                  return (
                    <div key={id} className="trainer-tag">
                      <span>{trainer?.fullname}</span>
                      <span
                        className="trainer-tag-remove"
                        onClick={() => removeTrainer(id)}
                      >
                        ×
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="form-buttons">
            <button type="submit" className="btn btn-submit">
              {editingId ? 'Update' : 'Add'} Package
            </button>
            {editingId && (
              <button type="button" className="btn btn-cancel" onClick={handleCancel}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="package-table-container">
          <table className="package-table">
            <thead className="table-header">
              <tr>
                <th className="table-th">Package Name</th>
                <th className="table-th">Duration</th>
                <th className="table-th">Price</th>
                <th className="table-th">Discount</th>
                <th className="table-th">Max PT Days</th>
                <th className="table-th">PT</th>
                <th className="table-th">Trainers</th>
                <th className="table-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map(pkg => (
                <tr key={pkg.packageId}>
                  <td className="table-td">{pkg.packageName}</td>
                  <td className="table-td">{pkg.duration} days</td>
                  <td className="table-td">${pkg.price}</td>
                  <td className="table-td">{pkg.discount}%</td>
                  <td className="table-td">{pkg.maxPtMeetingDays || 'N/A'}</td>
                  <td className="table-td">
                    <span className={`pt-badge ${pkg.pt ? 'pt-badge-yes' : 'pt-badge-no'}`}>
                      {pkg.pt ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="table-td trainer-list">
                    {pkg.trainerIds
                      .map(id => trainers.find(t => t.id === id)?.fullname || '')
                      .filter(name => name)
                      .join(', ') || 'None'}
                  </td>
                  <td className="table-td">
                    <div className="action-buttons">
                      <button className="btn-edit" onClick={() => handleEdit(pkg)}>
                        Edit
                      </button>
                      <button className="btn-delete" onClick={() => handleDelete(pkg.packageId)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}