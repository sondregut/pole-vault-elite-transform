
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AuthRequiredMessageProps {
  onLoginClick: () => void;
}

const AuthRequiredMessage: React.FC<AuthRequiredMessageProps> = ({ onLoginClick }) => {
  return (
    <div className="bg-white rounded-lg shadow p-8 text-center">
      <p className="text-lg mb-6">Please sign in to access your digital products</p>
      <Button onClick={onLoginClick}>Sign In</Button>
    </div>
  );
};

export default AuthRequiredMessage;
