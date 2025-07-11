// Callback.tsx
import axios from "axios"; // Not strictly needed here anymore, but okay if left
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Callback: React.FC = () => {
    const navigate = useNavigate();
  
    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get("access_token");
      const expiresIn = params.get("expires_in"); // Retrieve expires_in from URL

      if (accessToken) {
        localStorage.setItem("access_token", accessToken);
        // It's good practice to store the expiration time if you plan to implement token refresh
        localStorage.setItem("expires_in", expiresIn || "3600"); // Default to 1 hour if not provided
        navigate("/dashboard");
      } else {
        console.error("Access token missing from URL parameters.");
        // Redirect to the homepage/login if token is not found
        navigate("/"); 
      }
    }, [navigate]);
  
    return <div>Loading...</div>;
  };

export default Callback;