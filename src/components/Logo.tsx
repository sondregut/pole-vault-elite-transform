
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <div className="h-10 w-10">
        <img 
          src="/lovable-uploads/d8bb7de8-16df-4057-b550-54a2932ea222.png" 
          alt="PoleVault Elite Logo" 
          className="h-full w-full object-contain"
        />
      </div>
      <span className="font-bold text-xl text-gray-900">PoleVault Elite</span>
    </Link>
  );
};

export default Logo;
