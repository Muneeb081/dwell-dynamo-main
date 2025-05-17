
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { sendMessage } from '@/lib/data';
import { MessageSquare } from 'lucide-react';

interface ContactFormProps {
  receiverId: string;
  receiverName: string;
  propertyId: string;
  propertyTitle: string;
}

const ContactForm = ({ receiverId, receiverName, propertyId, propertyTitle }: ContactFormProps) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to contact the property owner",
        variant: "destructive"
      });
      navigate('/login', { state: { returnUrl: `/property/${propertyId}` } });
      return;
    }
    
    if (!message.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter a message",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await sendMessage({
        senderId: user.id,
        receiverId,
        content: message,
        propertyId,
        propertyTitle
      });
      
      toast({
        title: "Message Sent",
        description: `Your message has been sent to ${receiverName}`,
      });
      
      setMessage('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder={`Send a message to ${receiverName} about this property...`}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="min-h-[120px]"
      />
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting || !message.trim()}
      >
        <MessageSquare className="mr-2 h-4 w-4" />
        Send Message
      </Button>
    </form>
  );
};

export default ContactForm;
