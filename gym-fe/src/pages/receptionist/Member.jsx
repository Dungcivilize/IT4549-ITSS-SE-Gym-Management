import React, { useEffect, useState } from 'react';
import MemberList from "../components/receptionist/MemberList";
import MemberForm from '../components/receptionist/MemberForm';

export default function Member() {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [reload, setReload] = useState(false); 

  useEffect(() => {
    fetch('http://localhost:8080/api/receptionist/members')
      .then(res => res.json())
      .then(setMembers)
      .catch(console.error);
  }, [reload]);

  const handleEdit = (member) => {
    setSelectedMember(member);
  };

  const handleSuccess = () => {
    setSelectedMember(null);
    setReload(prev => !prev);
  };

  return (
    <div>
      <h1>Quản lý thành viên</h1>
      <MemberForm member={selectedMember} onSuccess={handleSuccess} />
      <hr />
      <MemberList members={members} onEdit={handleEdit} onReload={() => setReload(prev => !prev)} />
    </div>
  );
}
