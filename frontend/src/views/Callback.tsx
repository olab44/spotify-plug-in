import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const token = hashParams.get('access_token');

    if (token) {
      localStorage.setItem('access_token', token);
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/');
    }
  }, [navigate]);

  return <div>Loading...</div>;
};
