import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { authenticateUser, users } from '@/lib/data';
import { AuthUser } from '@/types/auth';

interface AuthError {
  message: string;
  code: string;
}

export const useAuthentication = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const { toast } = useToast();
  
  // Check for saved user on initial load
  const initializeAuth = () => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      localStorage.removeItem('user');
      setError({
        message: 'Failed to restore user session',
        code: 'INIT_ERROR'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const result = await authenticateUser(email, password);
      if (result.success && result.user) {
        setUser(result.user);
        
        localStorage.setItem('user', JSON.stringify(result.user));
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${result.user.name}! You're logged in as ${result.user.role}.`,
        });
        return true;
      } else {
        setError({
          message: result.message || "Invalid email or password",
          code: "AUTH_ERROR"
        });
        toast({
          variant: "destructive",
          title: "Login failed",
          description: result.message || "Invalid email or password",
        });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setError({
        message: errorMessage,
        code: "UNKNOWN_ERROR"
      });
      toast({
        variant: "destructive",
        title: "Login failed",
        description: errorMessage,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      setUser(null);
      localStorage.removeItem('user');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "There was an error logging you out. Please try again.",
      });
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if email already exists
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        setError({
          message: "Email already exists. Please use a different email or log in.",
          code: "EMAIL_EXISTS"
        });
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: "Email already exists. Please use a different email or log in.",
        });
        return false;
      }
      
      // Determine role based on email (matching login behavior)
      const role = email.includes('admin') ? 'admin' : 'user';
      
      // In a real app, this would be a server call to create a new user
      const newUser: AuthUser = {
        id: `u${users.length + 1}`,
        name,
        email,
        role,
        favorites: [],
        searchHistory: []
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      toast({
        title: "Registration successful",
        description: `Welcome, ${name}! You've been registered as a ${role}.`,
      });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setError({
        message: errorMessage,
        code: "REGISTRATION_ERROR"
      });
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: errorMessage,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    setUser,
    isLoading,
    isLoggedIn: user !== null,
    error,
    login,
    logout,
    register,
    initializeAuth
  };
};
