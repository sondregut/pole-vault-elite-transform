
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import { Menu, LogIn, LogOut, User, BarChart3 } from "lucide-react";
import CartIcon from "./CartIcon";
import { useAuth } from "@/hooks/useAuth";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Update the interface to include the external property
interface NavLink {
  name: string;
  href: string;
  external?: boolean;
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, isAdmin, loading, signOut } = useAuth();
  const { user: vaultUser } = useFirebaseAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navLinks: NavLink[] = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "1:1 Coaching", href: "/coaching" },
    { name: "Blog", href: "/blog" },
    // { name: "Video Library", href: "/video-library" }, // Temporarily hidden
    { name: "Vault App", href: "/vault" },
    { name: "Programs", href: "/shop" },
    { name: "Contact", href: "/contact" },
  ];

  const handleLinkClick = () => {
    window.scrollTo(0, 0);
    if (isOpen) {
      setIsOpen(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 bg-white z-50 transition-shadow ${isScrolled ? "shadow-md" : ""}`}>
      <div className="container mx-auto py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Logo />
          <h1 className="font-medium text-gray-800 text-lg">G-Force Training</h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            link.external ? (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 font-medium hover:text-primary transition"
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                to={link.href}
                className={`text-gray-800 font-medium hover:text-primary transition ${
                  location.pathname === link.href ? "text-primary" : ""
                }`}
                onClick={handleLinkClick}
              >
                {link.name}
              </Link>
            )
          ))}

          {/* Vault Dashboard Link for authenticated users */}
          {vaultUser && (
            <Link
              to="/vault/dashboard"
              className={`text-blue-600 font-medium hover:text-blue-700 transition flex items-center gap-1 ${
                location.pathname === "/vault/dashboard" ? "text-blue-800" : ""
              }`}
              onClick={handleLinkClick}
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Link>
          )}

          <CartIcon />
          
          {/* Auth Button - Temporarily Hidden */}
          {/* {!loading && (
            user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    {user.email?.split('@')[0]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin/videos">Admin Panel</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="outline" size="sm">
                <Link to="/auth">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
              </Button>
            )
          )} */}
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden flex items-center">
          <CartIcon />
          {/* Mobile Auth Button - Temporarily Hidden */}
          {/* {!loading && !user && (
            <Button asChild variant="outline" size="sm" className="mr-2">
              <Link to="/auth">
                <LogIn className="h-4 w-4" />
              </Link>
            </Button>
          )} */}
          <button
            onClick={toggleMenu}
            className="p-2 ml-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6 text-gray-800" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md">
          <div className="container mx-auto py-4 flex flex-col">
            {navLinks.map((link) => (
              link.external ? (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 text-gray-900 hover:text-primary border-b border-gray-100"
                  onClick={toggleMenu}
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`py-3 text-gray-900 hover:text-primary border-b border-gray-100 ${
                    location.pathname === link.href ? "text-primary" : ""
                  }`}
                  onClick={handleLinkClick}
                >
                  {link.name}
                </Link>
              )
            ))}

            {/* Vault Dashboard Link for mobile */}
            {vaultUser && (
              <Link
                to="/vault/dashboard"
                className={`py-3 text-blue-600 hover:text-blue-700 border-b border-gray-100 flex items-center gap-2 ${
                  location.pathname === "/vault/dashboard" ? "text-blue-800" : ""
                }`}
                onClick={handleLinkClick}
              >
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </Link>
            )}
            
            {/* Mobile Auth Section - Temporarily Hidden */}
            {/* {!loading && (
              user ? (
                <div className="py-3 border-b border-gray-100">
                  <div className="text-sm text-gray-600 mb-2">Signed in as {user.email}</div>
                  {isAdmin && (
                    <Link 
                      to="/admin/videos" 
                      className="block py-2 text-gray-900 hover:text-primary"
                      onClick={handleLinkClick}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center py-2 text-gray-900 hover:text-primary"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="py-3 text-gray-900 hover:text-primary border-b border-gray-100 flex items-center"
                  onClick={handleLinkClick}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
              )
            )} */}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
