
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import MessageList from '@/components/messaging/MessageList';

const MessagesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { returnUrl: '/messages' } });
    }
  }, [user, navigate]);

  return (
    <MainLayout>
      <div className="bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-heading font-bold mb-8">Messages</h1>
          
          {user ? (
            <MessageList />
          ) : (
            <div className="text-center p-8">
              Please log in to view your messages
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default MessagesPage;
