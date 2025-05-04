
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RedirectToApp = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/app");
  }, [navigate]);

  return null;
};

export default RedirectToApp;
