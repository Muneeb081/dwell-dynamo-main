import { useToast } from '@/components/ui/use-toast';
import { AuthUser } from '@/types/auth';

export const useAdminOperations = (user: AuthUser | null) => {
  const { toast } = useToast();
  
  // Check if the current user has admin role
  const isAdmin = user?.role === 'admin';
  
  // Admin function to remove a property listing
  const removeProperty = async (propertyId: string): Promise<void> => {
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Permission Denied",
        description: "Only administrators can remove property listings.",
      });
      return;
    }
    
    try {
      // In a real app, this would be an API call to remove the property
      // For this demo, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Property Removed",
        description: "The property listing has been successfully removed.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove the property listing.",
      });
      throw error;
    }
  };
  
  // Admin function to update a user's role
  const updateUserRole = async (userId: string, role: 'user' | 'admin'): Promise<void> => {
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Permission Denied",
        description: "Only administrators can update user roles.",
      });
      return;
    }
    
    try {
      // In a real app, this would be an API call to update the user's role
      // For this demo, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Role Updated",
        description: `User role has been updated to ${role}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user role.",
      });
      throw error;
    }
  };

  return {
    isAdmin,
    removeProperty,
    updateUserRole
  };
};
