import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, User } from 'lucide-react';
import { AdminKeyModal } from '@/components/auth/AdminKeyModal';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState<'user' | 'admin' | null>(null);
  const [showAdminKeyModal, setShowAdminKeyModal] = useState(false);
  const [isAdminKeyVerified, setIsAdminKeyVerified] = useState(false);

  const handleRoleSelect = (role: 'user' | 'admin') => {
    if (role === 'admin') {
      setShowAdminKeyModal(true);
    } else {
      setSelectedRole(role);
    }
  };

  const handleAdminKeySuccess = () => {
    setShowAdminKeyModal(false);
    setIsAdminKeyVerified(true);
    setSelectedRole('admin');
  };

  // If a role is selected and (it's a user role or admin key is verified), show the registration form
  if (selectedRole && (selectedRole === 'user' || isAdminKeyVerified)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <RegisterForm role={selectedRole} onBack={() => setSelectedRole(null)} />
      </div>
    );
  }

  // Show role selection screen
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <Link to="/" className="flex justify-center mb-4">
            <span className="text-teal-700 dark:text-teal-400 font-heading font-bold text-2xl">
              DwellDynamo
            </span>
          </Link>
          <CardTitle className="text-2xl font-heading text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Choose how you want to register
          </CardDescription>
        </CardHeader>

        <div className="p-6 grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center space-y-2"
            onClick={() => handleRoleSelect('user')}
          >
            <User className="h-8 w-8" />
            <span>Register as User</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center space-y-2"
            onClick={() => handleRoleSelect('admin')}
          >
            <Shield className="h-8 w-8" />
            <span>Register as Admin</span>
          </Button>
        </div>

        <div className="px-6 pb-6 text-center">
          <div className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Button variant="link" className="p-0 h-auto font-normal" asChild>
              <Link to="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </Card>

      <AdminKeyModal
        isOpen={showAdminKeyModal}
        onClose={() => setShowAdminKeyModal(false)}
        onSuccess={handleAdminKeySuccess}
      />
    </div>
  );
}
