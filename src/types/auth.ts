// Define the shape of the user without password
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  role: 'user' | 'admin';
  favorites: string[];
  searchHistory: {
    query: string;
    timestamp: string;
  }[];
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}
