// Dashboard.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LogoutButton from '@/components/LogoutButton';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ display_name: string; email: string } | null>(null);

  useEffect(() => {
    let accessToken = localStorage.getItem("access_token");

    // If no token in localStorage, try to get it from the URL
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
        // Clean the URL to remove the token after storing it
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    if (!accessToken) {
      console.error("No access token found in localStorage or URL. Redirecting to login.");
      navigate("/");
      return;
    }

    const fetchUserInfo = async () => {
      try {
        // Use the token from localStorage (or from URL if it was just stored)
        const response = await axios.get("http://localhost:8000/spotify/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUser(response.data);

      } catch (error) {
        console.error("Failed to fetch user info:", error);
        localStorage.removeItem("access_token");
        localStorage.removeItem("expires_in");
        navigate("/");
      }
    };

    fetchUserInfo();
  }, [navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      {user ? (
        <>
          <h1 className="text-3xl font-bold mb-4">Welcome, {user.display_name}!</h1>
          <p className="text-gray-700 mb-6">Email: {user.email}</p>
        </>
      ) : (
        <p className="text-xl text-gray-600">Loading user info...</p>
      )}
      <LogoutButton />
    </div>
  );
};

export default Dashboard;