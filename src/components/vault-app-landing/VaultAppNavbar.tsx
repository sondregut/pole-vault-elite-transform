import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Sparkles } from 'lucide-react';

const VaultAppNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'Features', id: 'features' },
    { label: 'Analytics', id: 'analytics' },
    { label: 'Pricing', id: 'pricing' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 font-roboto ${
        isScrolled ? 'bg-white shadow-vault' : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="#" className="flex items-center gap-2">
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
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-vault-text-secondary font-medium hover:text-vault-primary transition-colors"
              >
                {link.label}
              </button>
            ))}
            <a
              href="/vault/dashboard"
              className="px-4 py-1.5 bg-vault-primary/10 text-vault-primary font-semibold rounded-lg border border-vault-primary/20 hover:bg-vault-primary hover:text-white transition-all"
            >
              My Dashboard
            </a>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center">
            <Button
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
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
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="block w-full text-left py-2 text-vault-text-secondary font-medium hover:text-vault-primary transition-colors"
              >
                {link.label}
              </button>
            ))}
            <a
              href="/vault/dashboard"
              className="block w-full text-center py-2.5 bg-vault-primary/10 text-vault-primary font-semibold rounded-lg border border-vault-primary/20 hover:bg-vault-primary hover:text-white transition-all"
            >
              My Dashboard
            </a>
            <div className="pt-3 border-t border-vault-border">
              <Button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                }}
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
