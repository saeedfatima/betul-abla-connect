
import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { user, login } = useAuth();
  const { toast } = useToast();

  if (user) {
    // Redirect based on user role
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'coordinator':
        return <Navigate to="/coordinator" replace />;
      case 'staff':
        return <Navigate to="/staff-dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(credentials.username, credentials.password);
      
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome to the Betul Abla Foundation dashboard!",
        });
      } else {
        toast({
          title: "Login Failed", 
          description: "Invalid username or password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-white mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">BA</span>
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold">Betul Abla Foundation</h1>
              <p className="text-sm opacity-80">Staff Access Portal</p>
            </div>
          </Link>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-ngo-primary-700">Staff Login</CardTitle>
            <p className="text-gray-600">Access your dashboard to manage foundation activities</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <Input
                  type="text"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  required
                  placeholder="Enter your username"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-ngo-primary-500 hover:bg-ngo-primary-600"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Demo Credentials:</h3>
              <div className="text-xs text-gray-600 space-y-1">
                <p><strong>Admin:</strong> username: admin, password: password123</p>
                <p><strong>Coordinator:</strong> username: coordinator, password: password123</p>
                <p><strong>Staff:</strong> username: staff, password: password123</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Website */}
        <div className="text-center mt-6">
          <Link to="/" className="text-white text-sm hover:underline opacity-80">
            ← Back to Main Website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
