import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useTopTracks = (period: string) => {
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTracks = async () => {
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        navigate("/");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/top-tracks/${period}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setTracks(response.data);
      } catch (err) {
        console.error("Failed to fetch tracks:", err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          localStorage.removeItem("access_token");
          navigate("/");
        }
        setTracks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [period, navigate]);

  return { tracks, loading };
};