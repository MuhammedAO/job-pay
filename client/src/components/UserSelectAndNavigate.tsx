
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserSelectAndNavigate: React.FC = () => {
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (userId.trim()) {
      navigate(`/deposit/${userId.trim()}`);
      setUserId(''); 
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="Enter User ID"
      />
      <button type="submit">Go to Deposit</button>
    </form>
  );
};

export default UserSelectAndNavigate;
