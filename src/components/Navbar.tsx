
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";

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

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Programs", href: "/programs" },
    { name: "1:1 Coaching", href: "/coaching" },
    { name: "PVT App", href: "https://g-forcetraining.com/", external: true },
    { name: "Success Stories", href: "/success-stories" },
    { name: "Shop", href: "/shop" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 bg-white z-50 transition-shadow ${isScrolled ? "shadow-md" : ""}`}>
      <div className="container mx-auto py-3 flex items-center justify-between">
        <Logo />

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
              >
                {link.name}
              </Link>
            )
          ))}
        </div>

        <Button className="hidden md:block">Apply for Coaching</Button>

        {/* Mobile Navigation Toggle */}
        <button
          onClick={toggleMenu}
          className="md:hidden w-10 h-10 flex items-center justify-center"
        >
          <i className="ri-menu-line text-gray-800 text-2xl"></i>
        </button>
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
                  onClick={toggleMenu}
                >
                  {link.name}
                </Link>
              )
            ))}
            <div className="mt-4">
              <Button className="w-full">Apply for Coaching</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
