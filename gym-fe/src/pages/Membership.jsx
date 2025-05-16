import React, { useEffect, useState } from 'react';

export default function Membership() {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/packages')
      .then(res => res.json())
      .then(setPackages)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>Danh sách gói Membership</h1>
      <ul>
        {packages.map(p => (
          <li key={p.packageId}>
            {p.packageName} - {p.duration} ngày - Giá: {p.price} VNĐ
          </li>
        ))}
      </ul>
    </div>
  );
}
