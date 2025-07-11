import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:8000/spotify/logout", {
                method: "POST",
                credentials: "include",
            });

            localStorage.removeItem("spotify_access_token");
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <button 
            onClick={handleLogout} 
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
            Logout
        </button>
    );
};

export default LogoutButton;
