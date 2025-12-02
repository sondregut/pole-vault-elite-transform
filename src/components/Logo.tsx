
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <div className="h-10 w-10">
        <img 
          src="/images/logo.png" 
          alt="STAVHOPP.NO Logo" 
          className="h-full w-full object-contain"
        />
      </div>
    </Link>
  );
};

export default Logo;
