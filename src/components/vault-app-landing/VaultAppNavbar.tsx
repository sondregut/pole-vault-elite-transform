import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Sparkles } from 'lucide-react';

interface VaultAppNavbarProps {
  hasBanner?: boolean;
}

const VaultAppNavbar = ({ hasBanner = false }: VaultAppNavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if we're on the landing page
  const isOnLandingPage = location.pathname === '/vault' || location.pathname === '/vault/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);

    if (isOnLandingPage) {
      // On landing page - scroll to section
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // On different page - navigate to landing page with hash
      navigate(`/vault#${id}`);
    }
  };

  const navLinks = [
    { label: 'Features', id: 'features' },
    { label: 'Analytics', id: 'analytics' },
    { label: 'Pricing', id: 'pricing' },
    { label: 'My Dashboard', id: 'dashboard', href: '/vault/dashboard' },
  ];

  return (
    <nav
      className={`fixed left-0 right-0 z-50 transition-all duration-200 font-roboto ${
        isScrolled ? 'bg-white shadow-vault' : 'bg-white/80 backdrop-blur-sm'
      } ${hasBanner ? 'top-[44px] sm:top-[48px]' : 'top-0'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/vault" className="flex items-center gap-2">
              <img
                src="/images/vault-logo.png"
                alt="VAULT Logo"
                className="h-8 w-8 object-contain"
              />
              <span className="text-vault-primary font-bold text-xl tracking-tight">VAULT</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.href ? (
                <a
                  key={link.id}
                  href={link.href}
                  className="text-vault-text-secondary font-medium hover:text-vault-primary transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-vault-text-secondary font-medium hover:text-vault-primary transition-colors"
                >
                  {link.label}
                </button>
              )
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="/vault/login"
              className="text-vault-text-secondary font-medium hover:text-vault-primary transition-colors"
            >
              Sign In
            </a>
            <Button
              onClick={() => scrollToSection('pricing')}
              className="bg-gradient-to-r from-vault-primary-dark to-vault-primary text-white font-semibold px-5 py-2 rounded-lg hover:shadow-vault-md transition-all"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Get 50% Off
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-vault-text-secondary hover:bg-vault-primary-muted transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-vault-border">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              link.href ? (
                <a
                  key={link.id}
                  href={link.href}
                  className="block w-full text-left py-2 text-vault-text-secondary font-medium hover:text-vault-primary transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="block w-full text-left py-2 text-vault-text-secondary font-medium hover:text-vault-primary transition-colors"
                >
                  {link.label}
                </button>
              )
            ))}
            <div className="pt-3 border-t border-vault-border">
              <Button
                onClick={() => scrollToSection('pricing')}
                className="w-full bg-gradient-to-r from-vault-primary-dark to-vault-primary text-white font-semibold py-3 rounded-lg"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Get 50% Off
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default VaultAppNavbar;
