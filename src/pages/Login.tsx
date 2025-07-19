
import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { user, profile, signIn, loading: authLoading } = useAuth();
  const { toast } = useToast();

  // Clear error when user starts typing
  useEffect(() => {
    if (error) {
      setError('');
    }
  }, [credentials.email, credentials.password]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (user) {
    // Redirect based on user role
    const userRole = profile?.role || 'staff';
    switch (userRole) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'coordinator':
        return <Navigate to="/coordinator" replace />;
      case 'staff':
        return <Navigate to="/staff" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!credentials.email.trim() || !credentials.password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const result = await signIn(credentials.email.trim(), credentials.password);
      
      if (!result.error) {
        toast({
          title: "Login Successful",
          description: "Welcome to the Betul Abla Foundation dashboard!",
        });
      } else {
        setError(result.error.message || 'Login failed. Please try again.');
        toast({
          title: "Login Failed", 
          description: result.error.message || "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  disabled={isLoading}
                  className="transition-colors focus:ring-2 focus:ring-ngo-primary-500"
                  autoComplete="email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    disabled={isLoading}
                    className="pr-10 transition-colors focus:ring-2 focus:ring-ngo-primary-500"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-ngo-primary-500 hover:bg-ngo-primary-600 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Demo Notice */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-700 mb-2">New Authentication System</h3>
              <div className="text-xs text-blue-600">
                <p>This app now uses Supabase authentication. Please sign up to create an account or use existing Supabase credentials.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Website */}
        <div className="text-center mt-6">
          <Link to="/" className="text-white text-sm hover:underline opacity-80 transition-opacity">
            ← Back to Main Website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
