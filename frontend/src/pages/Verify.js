import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Verify = () => {
  const { id } = useParams();
  const [message, setMessage] = useState('Verifying...');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        await axios.put(`http://localhost:5000/api/verify/${id}`);
        setMessage('✅ Email verified! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } catch (err) {
        setMessage('❌ Verification failed. Please try registering again.');
      }
    };
    verifyUser();
  }, [id, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Verification</h2>
        <p className={message.startsWith('✅') ? "text-green-600" : "text-red-600"}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default Verify;
