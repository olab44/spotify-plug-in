import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useTopArtists = (period: string) => {
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtists = async () => {
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        navigate("/");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/top-artists/${period}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setArtists(response.data);
      } catch (err) {
        console.error("Failed to fetch artists:", err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          localStorage.removeItem("access_token");
          navigate("/");
        }
        setArtists([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, [period, navigate]);

  return { artists, loading };
};