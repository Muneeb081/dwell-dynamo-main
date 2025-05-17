import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { logger } from '@/lib/logger';

interface AdminKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ADMIN_SECRET_KEY = import.meta.env.VITE_ADMIN_SECRET_KEY;

export function AdminKeyModal({ isOpen, onClose, onSuccess }: AdminKeyModalProps) {
  const [key, setKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  // Reset state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setKey('');
      setIsVerifying(false);
    }
  }, [isOpen]);

  const handleVerify = async () => {
    if (!key.trim()) {
      toast({
        title: "Error",
        description: "Please enter an admin key.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);

    try {
      // In a real application, you might want to verify this on the server side
      if (key === ADMIN_SECRET_KEY) {
        logger.info('Admin key verified successfully');
        toast({
          title: "Success",
          description: "Admin key verified successfully.",
        });
        onSuccess();
      } else {
        logger.error('Invalid admin key provided');
        toast({
          title: "Error",
          description: "Invalid admin key. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      logger.error('Admin key verification failed:', error);
      toast({
        title: "Error",
        description: "Failed to verify admin key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
      setKey('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Admin Verification Required</DialogTitle>
          <DialogDescription>
            Please enter the admin secret key to proceed with Google Sign-in as an administrator.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Input
              id="adminKey"
              type="password"
              placeholder="Enter admin key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleVerify();
                }
              }}
              disabled={isVerifying}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isVerifying}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleVerify} 
              disabled={!key.trim() || isVerifying}
            >
              {isVerifying ? 'Verifying...' : 'Verify & Continue'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 