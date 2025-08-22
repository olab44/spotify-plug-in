import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const useUserInfo = () => {
  const [user, setUser] = useState<{ display_name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      const params = new URLSearchParams(window.location.search);
      const tokenFromUrl = params.get("access_token");
      const expiresInFromUrl = params.get("expires_in");

      if (tokenFromUrl) {
        accessToken = tokenFromUrl;
        localStorage.setItem("access_token", accessToken);
        if (expiresInFromUrl) {
          localStorage.setItem("expires_in", expiresInFromUrl);
        }
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    if (!accessToken) {
      console.error("No access token found. Redirecting to login.");
      navigate("/");
      setLoading(false);
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("http://localhost:8000/spotify/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        localStorage.removeItem("access_token");
        localStorage.removeItem("expires_in");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  return { user, loading };
};