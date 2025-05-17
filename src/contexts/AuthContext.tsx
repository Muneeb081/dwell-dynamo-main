import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthUser } from '@/types/auth';
import { loginUser, registerNewUser, validateToken as validateTokenApi } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { initiateGoogleLogin } from '@/lib/googleAuth';
import { logger } from '@/lib/logger';
import { checkFavorite ,addFavorite,removeFavorite} from '@/lib/data';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  setUser: (user: AuthUser | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: (isAdmin?: boolean, isRegister?: boolean) => Promise<void>;
  isPropertyFavorite: (propertyId: string) => Promise<boolean>;
  addToFavorites: (propertyId: string) => Promise<void>;
  removeFromFavorites: (propertyId: string) => Promise<void>;
  addSearchQuery: (query: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Validate token and refresh if needed
  const validateToken = async (token: string): Promise<boolean> => {
    try {
      return await validateTokenApi(token);
    } catch (error) {
      logger.error('Token validation error:', error);
      return false;
    }
  };

  // Initialize auth state from secure storage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const isValid = await validateToken(token);
          if (!isValid) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            setUser(null);
            return;
          }

          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            const parsedUser = JSON.parse(savedUser) as AuthUser;
            setUser(parsedUser);
          }
        }
      } catch (error) {
        logger.error('Error initializing auth:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await loginUser({ email, password });
      
      if (!response.token || !response.user) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('authToken', response.token);
      
      const userData: AuthUser = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role === 'admin' ? 'admin' : 'user',
        image: response.user.image || '',
        phone: response.user.phone || '',
        favorites: response.user.favorites || [],
        searchHistory: response.user.searchHistory || []
      };

      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      toast({
        title: 'Login successful',
        description: `Welcome back, ${userData.name}!`,
      });
    } catch (error) {
      logger.error('Login error:', error);
      if (error instanceof Error) {
        if (error.message.includes('credentials')) {
          throw new Error('Invalid email or password. Please try again.');
        } else if (error.message.includes('network')) {
          throw new Error('Network error. Please check your connection and try again.');
        }
      }
      throw new Error('Login failed. Please try again.');
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      const response = await registerNewUser({ name, email, password });
      localStorage.setItem('authToken', response.token);
      const userData: AuthUser = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role === 'admin' ? 'admin' : 'user',
        image: response.user.image,
        phone: response.user.phone,
        favorites: response.user.favorites || [],
        searchHistory: response.user.searchHistory || []
      };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      toast({
        title: 'Registration successful',
        description: 'Welcome to our platform!',
      });
    } catch (error) {
      logger.error('Registration error:', error);
      if (error instanceof Error) {
        if (error.message.includes('exists')) {
          throw new Error('An account with this email already exists.');
        } else if (error.message.includes('network')) {
          throw new Error('Network error. Please check your connection and try again.');
        }
      }
      throw new Error('Registration failed. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setUser(null);
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
      navigate('/');
    } catch (error) {
      logger.error('Logout error:', error);
      throw new Error('Logout failed. Please try again.');
    }
  };

  const handleGoogleLogin = async (isAdmin = false, isRegister = false) => {
    try {
      localStorage.setItem('googleLoginType', isAdmin ? 'admin' : 'user');
      await initiateGoogleLogin(isRegister);
    } catch (error) {
      logger.error('Google login error:', error);
      throw new Error(`Google ${isRegister ? 'registration' : 'login'} failed. Please try again.`);
    }
  };

const isPropertyFavorite = async (propertyId: string): Promise<boolean> => {
  try {
    const response = await checkFavorite(propertyId);
    return response?.isFavorite ?? false;
  } catch (error) {
    console.error("Failed to check if property is favorite:", error);
    return false;
  }
};


const addToFavorites = async (propertyId: string) => {
  if (!user) return;

  try {
    const response = await addFavorite(propertyId); // Call the API
console.log()
    if (response.success) {
      const updatedUser: AuthUser = {
        ...user,
        favorites: [...(user.favorites || []), propertyId],
      };

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } else {
      console.error("Failed to add favorite:", response.message || "Unknown error");
    }
  } catch (error) {
    console.error("Error adding property to favorites:", error);
  }
};

const removeFromFavorites = async (propertyId: string) => {
  if (!user) return;

  try {
    const response = await removeFavorite(propertyId); // API call

    if (response.success) {
      const updatedUser: AuthUser = {
        ...user,
        favorites: user.favorites?.filter(id => id !== propertyId) || [],
      };

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } else {
      console.error("Failed to remove favorite:", response.message || "Unknown error");
    }
  } catch (error) {
    console.error("Error removing property from favorites:", error);
  }
};


  const addSearchQuery = (query: string) => {
    if (user) {
      const updatedUser: AuthUser = {
        ...user,
        searchHistory: [
          ...(user.searchHistory || []),
          { query, timestamp: new Date().toISOString() },
        ],
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    loading,
    isLoggedIn: !!user,
    isAdmin: user?.role === 'admin',
    setUser,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    loginWithGoogle: handleGoogleLogin,
    isPropertyFavorite,
    addToFavorites,
    removeFromFavorites,
    addSearchQuery,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
