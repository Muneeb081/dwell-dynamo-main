import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, User } from 'lucide-react';
import { AdminKeyModal } from './AdminKeyModal';
import { LoginView } from './LoginView';
import { useAuth } from '@/contexts/AuthContext';

export function RoleSelector() {
  const [selectedRole, setSelectedRole] = useState<'user' | 'admin' | null>(null);
  const [isAdminKeyVerified, setIsAdminKeyVerified] = useState(false);
  const [showAdminKeyModal, setShowAdminKeyModal] = useState(false);
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  const handleRoleSelect = (role: 'user' | 'admin') => {
    if (role === 'admin') {
      setShowAdminKeyModal(true);
    } else {
      setSelectedRole(role);
    }
  };

  const handleAdminKeySuccess = async () => {
    setShowAdminKeyModal(false);
    setIsAdminKeyVerified(true);
    setSelectedRole('admin');
    try {
      await loginWithGoogle(true);
    } catch (error) {
      console.error('Failed to initiate admin login:', error);
    }
  };

  if (selectedRole) {
    return (
      <LoginView 
        role={selectedRole} 
        onBack={() => {
          setSelectedRole(null);
          setIsAdminKeyVerified(false);
        }}
        isAdminKeyVerified={isAdminKeyVerified}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome to DwellDynamo</h1>
        <p className="text-sm text-muted-foreground">Choose how you want to sign in</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="h-24 flex flex-col items-center justify-center space-y-2"
          onClick={() => handleRoleSelect('user')}
        >
          <User className="h-8 w-8" />
          <span>Sign in as User</span>
        </Button>
        <Button
          variant="outline"
          className="h-24 flex flex-col items-center justify-center space-y-2"
          onClick={() => handleRoleSelect('admin')}
        >
          <Shield className="h-8 w-8" />
          <span>Sign in as Admin</span>
        </Button>
      </div>

      <AdminKeyModal
        isOpen={showAdminKeyModal}
        onClose={() => setShowAdminKeyModal(false)}
        onSuccess={handleAdminKeySuccess}
      />
    </div>
  );
} 