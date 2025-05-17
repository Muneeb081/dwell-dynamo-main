import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Property, deleteProperty, updateProperty, getProperty ,updatePropertyStatus} from '@/lib/data';
import { logger } from '@/lib/logger';

// Admin components
import AdminHeader from '@/components/admin/AdminHeader';
import AdminStats from '@/components/admin/AdminStats';
import PropertyManagement from '@/components/admin/PropertyManagement';

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [adminProperties, setAdminProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchProperties = async () => {
  try {
    setIsLoading(true); // Start loading

    const response = await getProperty();

    setAdminProperties(response);
    logger.info('Admin properties loaded', { count: response.length });
  } catch (error) {
    logger.error('Error loading admin properties:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to load property data.",
    });
  } finally {
    setIsLoading(false); // Stop loading in all cases
  }
};
  useEffect(() => {
    // Check if user is admin
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You don't have permission to access this page.",
      });
      navigate('/dashboard');
      return;
    }
    
    // Fetch properties


    
    fetchProperties();
  }, [user, isAdmin, navigate, toast]);
  
  const handleRemoveProperty = async (propertyId: string) => {
    try {
      const result = await deleteProperty(propertyId);
      
      if (result.success) {
        setAdminProperties(prev => prev.filter(p => p.id !== propertyId));
        toast({
          title: "Property Removed",
          description: "The property has been successfully removed.",
        });
        logger.info('Property removed successfully', { propertyId });
      } else {
        throw new Error(result.Message);
      }
    } catch (error) {
      logger.error('Error removing property:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove property. Please try again.",
      });
    } finally{
      fetchProperties();
    };
  };

  const handleUpdatePropertyStatus = async (propertyId: string, newStatus: 'sale' | 'rent') => {
    try {
      // Pass status as an object with the correct syntax
      const result = await updatePropertyStatus(propertyId, newStatus );

      if (result) {
        // Update the property list in the state
        setAdminProperties(prev =>
            prev.map(property =>
                property._id === propertyId
                    ? { ...property, status: newStatus }
                    : property
            )
        );

        // Show success toast
        toast({
          title: "Status Updated",
          description: `Property status changed to ${newStatus === 'sale' ? 'For Sale' : 'For Rent'}.`,
        });

        // Log the successful update
        logger.info('Property status updated', { propertyId, newStatus });
      } else {
        throw new Error(result);
      }
    } catch (error) {
      // Handle error
      logger.error('Error updating property status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update property status. Please try again.",
      });
    }
  };


  const handleEditProperty = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
  };
  
  const handleAddProperty = () => {
    navigate('/add-property');
  };
  
  return (
    <MainLayout>
      <div className="bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdminHeader />
          <AdminStats propertiesCount={adminProperties.length} />
          <PropertyManagement 
            properties={adminProperties}
            isLoading={isLoading}
            onAddProperty={handleAddProperty}
            onEditProperty={handleEditProperty}
            onRemoveProperty={handleRemoveProperty}
            onUpdateStatus={handleUpdatePropertyStatus}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminPage;
