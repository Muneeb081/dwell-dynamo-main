import { useState, useRef, useEffect } from 'react';
import { Bot, Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Message } from '@/types/chat';
import { FormattedMessage } from './chat/FormattedMessage';
import { format } from 'date-fns';

export function PropertyChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTimestamp = (date: Date) => {
    return format(date, 'h:mm a');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate bot response - replace with actual API call
      const botResponse = `Before buying land in Islamabad, consider these essential parameters:

**Location**

* Accessibility, proximity to amenities (schools, hospitals, markets), and future development potential.

**Legal Verification**

* Title deed verification, ownership history, encumbrances (loans, liens), and NOCs from relevant authorities (CDA, etc.).

**Land Use**

* Ensure the land use aligns with your intended purpose (residential, commercial, agricultural) as per CDA's master plan.`;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col  border rounded-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3 p-4 rounded-lg",
              message.sender === 'user' 
                ? "bg-muted/50 flex-row" 
                : "bg-primary/5 flex-row-reverse"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              message.sender === 'user' ? "bg-primary" : "bg-primary/20"
            )}>
              {message.sender === 'user' ? (
                <User className="w-5 h-5 text-primary-foreground" />
              ) : (
                <Bot className="w-5 h-5 text-primary" />
              )}
            </div>
            <div className={cn(
              "flex-1",
              message.sender === 'user' ? "text-left" : "text-left"
            )}>
              {message.sender === 'bot' ? (
                <FormattedMessage text={message.text} />
              ) : (
                <p className="text-sm">{message.text}</p>
              )}
              <span className="text-xs text-muted-foreground block mt-1">
                {formatTimestamp(message.timestamp)}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
} 