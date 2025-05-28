
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import { Menu } from "lucide-react";
import CartIcon from "./CartIcon";

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
    { name: "App", href: "/coming-soon" },
    { name: "Programs", href: "/shop" },
    { name: "Contact", href: "/contact" },
  ];

  const handleLinkClick = () => {
    window.scrollTo(0, 0);
    if (isOpen) {
      setIsOpen(false);
    }
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
          <CartIcon />
        </div>

        {/* Mobile Navigation Toggle - Updated with Lucide Menu icon */}
        <div className="md:hidden flex items-center">
          <CartIcon />
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
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
