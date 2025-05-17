import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { handleGoogleCallback } from '@/lib/googleAuth';
import { logger } from '@/lib/logger';
import { useAuth } from '@/contexts/AuthContext';

export default function GoogleCallbackPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser } = useAuth();

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Get URL parameters from hash and search
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const searchParams = new URLSearchParams(window.location.search);
        
        // Combine hash and search parameters
        const params = new URLSearchParams();
        for (const [key, value] of hashParams.entries()) {
          params.append(key, value);
        }
        for (const [key, value] of searchParams.entries()) {
          params.append(key, value);
        }

        logger.info('Processing Google callback', {
          hasAccessToken: params.has('access_token'),
          hasState: params.has('state'),
          isRegister: localStorage.getItem('googleIsRegister') === 'true'
        });
        
        // Process the callback
        const user = await handleGoogleCallback(params);
        // Update auth context
        setUser(user);

     
        // Show success message
        const isRegister = localStorage.getItem('googleIsRegister') === 'true';
        toast({
          title: isRegister ? 'Successfully registered' : 'Successfully signed in',
          description: isRegister ? `Welcome to DwellDynamo, ${user.name}!` : `Welcome back, ${user.name}!`,
        });

        // Navigate to dashboard
        navigate('/dashboard');
      } catch (error) {
        logger.error('Error processing Google callback:', error);
        
        // Show error message
        toast({
          variant: 'destructive',
          title: 'Authentication failed',
          description: error instanceof Error ? error.message : 'Failed to complete sign in. Please try again.',
        });

        // Navigate back to login or register page
        const isRegister = localStorage.getItem('googleIsRegister') === 'true';
        navigate(isRegister ? '/register' : '/login');
      }
    };

    processCallback();
  }, [navigate, setUser, toast]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Completing sign in...</h2>
        <p className="text-muted-foreground">Please wait while we verify your credentials.</p>
      </div>
    </div>
  );
} 