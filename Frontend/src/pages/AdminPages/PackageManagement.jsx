import React, { useEffect, useState } from 'react';
import axios from 'axios';

const styles = {
  container: { maxWidth: '900px', margin: '0 auto', padding: '20px' },
  title: { textAlign: 'center', color: '#1e40af', fontSize: '2rem', fontWeight: 'bold', marginBottom: '30px' },
  button: { padding: '10px 15px', marginBottom: '20px', cursor: 'pointer', borderRadius: '5px', border: 'none', backgroundColor: '#3b82f6', color: '#fff' },
  form: { display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '15px', marginBottom: '40px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' },
  input: { padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1rem', width: '100%' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', border: '1px solid #ccc' },
  th: { border: '1px solid #ddd', padding: '10px', backgroundColor: '#f3f4f6', textAlign: 'center' },
  td: { border: '1px solid #ddd', padding: '8px', textAlign: 'center' },
  actionButtons: { display: 'flex', gap: '8px', justifyContent: 'center' },
  editButton: { backgroundColor: '#fbbf24', border: 'none', borderRadius: '4px', padding: '6px 12px', color: 'white', cursor: 'pointer' },
  deleteButton: { backgroundColor: '#ef4444', border: 'none', borderRadius: '4px', padding: '6px 12px', color: 'white', cursor: 'pointer' },
  cancelButton: { backgroundColor: '#9ca3af', border: 'none', borderRadius: '4px', padding: '6px 12px', color: 'white', cursor: 'pointer' },
  submitButton: { backgroundColor: '#10b981', border: 'none', borderRadius: '4px', padding: '6px 12px', color: 'white', cursor: 'pointer' },
};

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
    if (editingId) {
      await axios.put(`http://localhost:8080/api/membership-packages/${editingId}`, formData);
    } else {
      await axios.post('http://localhost:8080/api/membership-packages', formData);
    }
    setFormData({ packageName: '', duration: '', price: '', maxPtMeetingDays: '', discount: '', pt: false, trainerIds: [] });
    setEditingId(null);
    fetchPackages();
  };

  const handleEdit = pkg => {
    setFormData({
      packageName: pkg.packageName,
      duration: pkg.duration,
      price: pkg.price,
      packageType: pkg.packageType,
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
    setFormData({ packageName: '', duration: '', price: '', packageType: '', pt: false, trainerIds: [] });
    setEditingId(null);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Package Management</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
  <input style={styles.input} name="packageName" placeholder="Package Name" value={formData.packageName} onChange={handleChange} required />
  <input style={styles.input} name="duration" placeholder="Duration (days)" type="number" value={formData.duration} onChange={handleChange} required />
  {( formData.pt && <input style={styles.input} name="maxPtMeetingDays" placeholder="Max PT Meeting Days" type="number" value={formData.maxPtMeetingDays} onChange={handleChange} required />)}
  <input style={styles.input} name="price" placeholder="Price" type="number" value={formData.price} onChange={handleChange} required />
  <input style={styles.input} name="discount" step={0.01}
  min={0} type="number"
  placeholder="Discount (%)" value={formData.discount} onChange={handleChange} required/>

  {/* Checkbox chọn có PT hay không */}
  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <input
      type="checkbox"
      name="pt"
      checked={formData.pt}
      onChange={handleChange}
    />
    Personal Trainer (PT)
  </label>

  {/* Hiển thị phần chọn Trainer nếu pt === true */}
  {formData.pt && (
    <>
      <label>Choose Trainers:</label>
      <select style={styles.input} onChange={handleTrainerSelect}>
        <option value="">-- Select Trainer --</option>
        {trainers
          .filter(t => !formData.trainerIds.includes(t.id))
          .map(t => (
            <option key={t.id} value={t.id}>
              {t.fullname}
            </option>
          ))}
      </select>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {formData.trainerIds.map(id => {
          const trainer = trainers.find(t => t.id === id);
          return (
            <div
              key={id}
              style={{
                background: '#e0f2fe',
                padding: '5px 10px',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>{trainer?.fullname}</span>
              <span
                onClick={() =>
                  setFormData({
                    ...formData,
                    trainerIds: formData.trainerIds.filter(tid => tid !== id),
                  })
                }
                style={{ color: 'red', cursor: 'pointer', fontWeight: 'bold' }}
              >
                x
              </span>
            </div>
          );
        })}
      </div>
    </>
  )}

  <div style={{ display: 'flex', gap: '10px' }}>
    <button type="submit" style={styles.submitButton}>{editingId ? 'Update' : 'Add'} Package</button>
    {editingId && <button type="button" style={styles.cancelButton} onClick={handleCancel}>Cancel</button>}
  </div>
</form>


      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Package Name</th>
            <th style={styles.th}>Duration</th>
            <th style={styles.th}>Price</th>
            <th style={styles.th}>Max PT Days</th>
            <th style={styles.th}>PT</th>
            <th style={styles.th}>Trainers</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {packages.map(pkg => (
            <tr key={pkg.packageId}>
              <td style={styles.td}>{pkg.packageName}</td>
              <td style={styles.td}>{pkg.duration}</td>
              <td style={styles.td}>{pkg.price}</td>
              <td style={styles.td}>{pkg.maxPtMeetingDays}</td>
              <td style={styles.td}>{pkg.pt ? 'Yes' : 'No'}</td>
              <td style={styles.td}>{pkg.trainerIds.map(id => trainers.find(t => t.id === id)?.fullname || '').join(', ')}</td>
              <td style={styles.actionButtons}>
                <button style={styles.editButton} onClick={() => handleEdit(pkg)}>Edit</button>
                <button style={styles.deleteButton} onClick={() => handleDelete(pkg.packageId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}