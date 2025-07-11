import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Callback: React.FC = () => {
    const navigate = useNavigate();
  
    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get("access_token");
      const expiresIn = params.get("expires_in");

      if (accessToken) {
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("expires_in", expiresIn || "3600");
        navigate("/dashboard");
      } else {
        console.error("Access token missing from URL parameters.");
        navigate("/"); 
      }
    }, [navigate]);
  
    return <div>Loading...</div>;
  };

export default Callback;