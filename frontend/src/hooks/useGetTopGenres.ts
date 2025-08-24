import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface GenreItem {
  genre: string;
  count: number;
}

export const useGetTopGenres = (period: string) => {
  const [genres, setGenres] = useState<GenreItem[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenres = async () => {
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        console.error("useTopGenres: No access token found. Redirecting to login.");
        navigate("/");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/top-genres/${period}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setGenres(response.data);
      } catch (err) {
        console.error("useTopGenres: Failed to fetch genres:", err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          localStorage.removeItem("access_token");
          navigate("/");
        }
        setGenres([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, [period, navigate]);

  return { genres, loading };
};