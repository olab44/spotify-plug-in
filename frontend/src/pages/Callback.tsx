import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Callback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      if (code) {
        try {
          const response = await axios.get(`http://localhost:8000/spotify/callback?code=${code}`);
          const userInfo = response.data;
          console.log(userInfo);  // Handle user info (e.g., save to state, local storage, etc.)
          navigate('/dashboard');  // Redirect to dashboard after successful login
        } catch (error) {
          console.error('Failed to fetch user info:', error);
        }
      }
    };

    fetchUserInfo();
  }, [navigate]);

  return <div>Loading...</div>;
};

export default Callback;