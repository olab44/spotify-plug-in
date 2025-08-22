import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Callback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Backend sets httpOnly cookie and redirects to /dashboard, so just navigate there.
    try {
      navigate("/dashboard");
    } catch (err) {
      console.error("Redirect failed:", err);
      navigate("/");
    }
  }, [navigate]);

  return <div>Loading...</div>;
};

export default Callback;