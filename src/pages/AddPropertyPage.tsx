
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import AddPropertyForm from '@/components/properties/AddPropertyForm';
import { Card } from '@/components/ui/card';

const AddPropertyPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { returnUrl: '/add-property' } });
    }
  }, [user, navigate]);

  return (
    <MainLayout>
      <div className="bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-heading font-bold mb-8">Add New Property</h1>
          
          <Card className="p-6 shadow-md">
            <AddPropertyForm />
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default AddPropertyPage;
