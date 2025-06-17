
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  userRole: 'admin' | 'coordinator' | 'staff';
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title, userRole }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
  };

  const getNavLinks = () => {
    const baseLinks = [
      { path: `/${userRole}`, label: 'Dashboard', icon: '📊' },
    ];

    if (userRole === 'admin') {
      return [
        ...baseLinks,
        { path: '/admin/orphans', label: 'Orphan Management', icon: '👶' },
        { path: '/admin/boreholes', label: 'Borehole Management', icon: '💧' },
        { path: '/admin/users', label: 'User Management', icon: '👥' },
        { path: '/admin/reports', label: 'Reports', icon: '📈' },
      ];
    }

    if (userRole === 'coordinator') {
      return [
        ...baseLinks,
        { path: '/admin/orphans', label: 'Orphan Management', icon: '👶' },
        { path: '/admin/boreholes', label: 'Borehole Management', icon: '💧' },
        { path: '/admin/reports', label: 'Reports', icon: '📈' },
      ];
    }

    return [
      ...baseLinks,
      { path: '/admin/reports', label: 'Reports', icon: '📈' },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-ngo-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">BA</span>
              </div>
              <span className="text-lg font-semibold text-ngo-primary-700">Betul Abla Foundation</span>
            </Link>
            <div className="text-sm text-gray-500">|</div>
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Welcome, <span className="font-semibold">{user?.fullName}</span>
              <span className="ml-2 px-2 py-1 bg-ngo-primary-100 text-ngo-primary-700 rounded-full text-xs capitalize">
                {user?.role}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm border-r min-h-screen">
          <nav className="p-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  location.pathname === link.path
                    ? 'bg-ngo-primary-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
            
            <div className="pt-4 border-t">
              <Link
                to="/"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <span>🌐</span>
                <span>Main Website</span>
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
