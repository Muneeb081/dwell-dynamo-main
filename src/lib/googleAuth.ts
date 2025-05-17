import { AuthUser } from '@/types/auth';
import { logger } from './logger';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
const API_BASE_URL = 'http://localhost:5000/api';

// Validate configuration
if (!GOOGLE_CLIENT_ID) {
  logger.error('Google Client ID is not configured. Please check your .env file.');
}

if (!GOOGLE_REDIRECT_URI) {
  logger.error('Google Redirect URI is not configured. Please check your .env file.');
}

export const initiateGoogleLogin = (isRegister = false) => {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_REDIRECT_URI) {
    throw new Error('Google authentication is not properly configured. Please contact support.');
  }

  try {
    // Generate a random state value for security
    const state = crypto.getRandomValues(new Uint8Array(16))
      .reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
    
    // Store state, timestamp, and registration flag in localStorage instead of sessionStorage
    localStorage.setItem('googleOAuthState', state);
    localStorage.setItem('googleOAuthTimestamp', Date.now().toString());
    localStorage.setItem('googleIsRegister', isRegister.toString());

    // Use implicit flow for client-side only apps
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.append('client_id', GOOGLE_CLIENT_ID);
    authUrl.searchParams.append('redirect_uri', GOOGLE_REDIRECT_URI);
    authUrl.searchParams.append('response_type', 'token');
    authUrl.searchParams.append('scope', 'email profile openid');
    authUrl.searchParams.append('include_granted_scopes', 'true');
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('prompt', 'select_account');

    logger.info('Initiating Google OAuth flow', { isRegister });
    window.location.href = authUrl.toString();
  } catch (error) {
    logger.error('Failed to initiate Google login:', error);
    throw new Error('Failed to initiate Google login. Please try again.');
  }
};

export const handleGoogleCallback = async (params: URLSearchParams): Promise<AuthUser> => {
  try {
    // Get state from URL parameters and localStorage
    const receivedState = params.get('state');
    const storedState = localStorage.getItem('googleOAuthState');
    const timestamp = parseInt(localStorage.getItem('googleOAuthTimestamp') || '0');
    const isRegister = localStorage.getItem('googleIsRegister') === 'true';
    
    logger.info('Validating OAuth state', { receivedState, storedState, isRegister });
    
    // Validate state
    if (!receivedState || !storedState || receivedState !== storedState) {
      logger.error('State mismatch:', { receivedState, storedState });
      throw new Error('Invalid OAuth state. Please try logging in again.');
    }

    // Check if the OAuth flow has expired (30 minutes)
    if (Date.now() - timestamp > 30 * 60 * 1000) {
      throw new Error('OAuth flow has expired. Please try logging in again.');
    }

    // Clear OAuth state data
    localStorage.removeItem('googleOAuthState');
    localStorage.removeItem('googleOAuthTimestamp');
    localStorage.removeItem('googleIsRegister');

    // Get access token from URL fragment
    const accessToken = params.get('access_token');
    if (!accessToken) {
      const error = params.get('error');
      if (error === 'access_denied') {
        throw new Error('Google login was cancelled.');
      }
      throw new Error('Failed to get access token from Google.');
    }

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to get user info from Google.');
    }

    const userData = await userResponse.json();
    
    // Get login type (admin/user) and remove from localStorage
    const loginType = localStorage.getItem('googleLoginType');
    localStorage.removeItem('googleLoginType');

    // Choose the appropriate endpoint based on registration flag
    const endpoint = isRegister ? 'google-register' : 'google-auth';
    
    logger.info('Sending request to backend', { endpoint, isRegister });
    
    // Send user data to backend for authentication/registration
    const authResponse = await fetch(`${API_BASE_URL}/users/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        googleId: userData.id,
        email: userData.email,
        name: userData.name,
        image: userData.picture,
        role: loginType === 'admin' ? 'admin' : 'user'
      }),
    });

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      logger.error('Google auth response error:', { status: authResponse.status, text: errorText });
      throw new Error('Failed to authenticate with Google. Please try again.');
    }

    const { token, user } = await authResponse.json();

    // Store localstorage token
    localStorage.setItem('authToken', token);

    // Store user data
    localStorage.setItem('user', JSON.stringify(user));

    logger.info('Google authentication successful', { userId: user.id, isRegister });
    return user;
  } catch (error) {
    logger.error('Google authentication error:', error);
    throw error instanceof Error ? error : new Error('Failed to complete Google authentication.');
  }
}; 