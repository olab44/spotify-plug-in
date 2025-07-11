import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 
            onClick={() => navigate("/")}
            className="text-xl font-semibold tracking-tight cursor-pointer hover:opacity-80 transition-opacity"
          >
            Soundscape
          </h1>
        </div>
        <div className="flex items-center gap-4">
        </div>
      </div>
    </header>
  );
};