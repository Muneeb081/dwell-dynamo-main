import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { GoogleSignInButton } from './GoogleSignInButton';
import { LoginForm } from './LoginForm';

interface LoginViewProps {
  role: 'user' | 'admin';
  onBack: () => void;
  isAdminKeyVerified: boolean;
}

export function LoginView({ role, onBack, isAdminKeyVerified }: LoginViewProps) {
  // Don't show anything if trying to access admin view without verification
  if (role === 'admin' && !isAdminKeyVerified) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          className="absolute left-4 top-4"
          onClick={onBack}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
      </div>

      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {role === 'admin' ? 'Admin Sign In' : 'Welcome back'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {role === 'admin' 
            ? 'Sign in to access admin features'
            : 'Sign in to your account to continue'
          }
        </p>
      </div>

      <div className="space-y-4">
        <GoogleSignInButton isAdmin={role === 'admin'} />
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with email
            </span>
          </div>
        </div>

        <LoginForm role={role} />
      </div>
    </div>
  );
} 