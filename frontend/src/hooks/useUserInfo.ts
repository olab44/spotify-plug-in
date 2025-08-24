import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface SpotifyUser {
  display_name: string;
  email: string;
}

export const useUserInfo = () => {
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        console.error("No access token found. Redirecting to login.");
        navigate("/");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:8000/spotify/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user info. Redirecting to login.", error);
        localStorage.removeItem("access_token");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserInfo();
  }, [navigate]);

  return { user, loading };
};