
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
              <div className="w-10 h-10 bg-ngo-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">BA</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-ngo-primary-700">Betul Abla Foundation</h1>
                <p className="text-sm text-gray-600">Humanitarian Care & Support</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-gray-700 hover:text-ngo-primary-600 transition-colors ${
                    location.pathname === link.path ? 'text-ngo-primary-600 font-semibold' : ''
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Button asChild className="bg-ngo-primary-500 hover:bg-ngo-primary-600">
                <Link to="/login">Staff Login</Link>
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/login" onClick={closeMobileMenu}>Login</Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="p-2"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t pt-4">
              <div className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-gray-700 hover:text-ngo-primary-600 transition-colors py-2 px-3 rounded-md ${
                      location.pathname === link.path ? 'text-ngo-primary-600 font-semibold bg-ngo-primary-50' : ''
                    }`}
                    onClick={closeMobileMenu}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-2 border-t">
                  <Button asChild className="w-full bg-ngo-primary-500 hover:bg-ngo-primary-600">
                    <Link to="/login" onClick={closeMobileMenu}>Staff Login</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-ngo-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">BA</span>
                </div>
                <span className="text-lg font-semibold">Betul Abla Foundation</span>
              </div>
              <p className="text-gray-400 text-sm">
                Dedicated to humanitarian care, supporting orphans and communities in Northern Nigeria.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Our Services</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Orphan Care & Support</li>
                <li>Monthly Feeding Programs</li>
                <li>Educational Assistance</li>
                <li>Borehole Construction</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Locations</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Kano State, Nigeria</li>
                <li>Jigawa State, Nigeria</li>
                <li>Brussels, Belgium (HQ)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Email: info@betulabla.org</li>
                <li>Phone: +32 xxx xxx xxx</li>
                <li>Address: Brussels, Belgium</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 Betul Abla Foundation. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
