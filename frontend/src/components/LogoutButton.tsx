import { useNavigate } from 'react-router-dom';

export const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');

    navigate('/');
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-green-500 text-white px-6 py-2 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-green-400 transition-colors duration-200 mt-4"
    >
      Logout
    </button>
  );
};
