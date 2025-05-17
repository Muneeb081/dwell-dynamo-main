interface User {
  name: string;
  email: string;
  password?: string;
  role?: string;
  googleId?: string;
  image?: string;
}

interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string;
    phone?: string;
    favorites: string[];
    searchHistory: {
      query: string;
      timestamp: string;
    }[];
  };
}

const baseUrl = "http://localhost:5000";

const registerNewUser = async (user: User): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${baseUrl}/api/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    const data: AuthResponse = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

const loginUser = async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
  try {
    console.log('Login request:', { email: credentials.email, password:"***"});
    
    const response = await fetch(`${baseUrl}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password
      }),
    });

    const responseData = await response.json();
    console.log('Login response:', responseData);

    if (!response.ok) {
      throw new Error(responseData.message || 'Login failed');
    }

    return responseData;
  } catch (error) {
    console.error('Login error details:', error);
    throw error;
  }
};

const validateToken = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch(`${baseUrl}/api/users/validate-token`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

export { registerNewUser, loginUser, validateToken, type User, type AuthResponse };
