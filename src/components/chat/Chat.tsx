import { useState } from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatInput } from './ChatInput';
import { ChatMessages } from './ChatMessages';
import { QuickQueries } from './QuickQueries';
import { Button } from '@/components/ui/button';
import { MessageSquare, HelpCircle } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

type ChatView = 'chat' | 'topics';

export function Chat() {
  const [view, setView] = useState<ChatView>('chat');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = (message: string) => {
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: `You said: ${message}` }]);
    }, 1000);
  };

  const handleQuerySelect = (query: string) => {
    handleSendMessage(query);
    setView('chat'); // Switch back to chat view after selecting a query
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat/Topics Toggle */}
      <div className="flex border-b">
        <Button
          variant={view === 'chat' ? 'default' : 'ghost'}
          className="flex-1 rounded-none gap-2"
          onClick={() => setView('chat')}
        >
          <MessageSquare className="h-4 w-4" />
          Chat
        </Button>
        <Button
          variant={view === 'topics' ? 'default' : 'ghost'}
          className="flex-1 rounded-none gap-2"
          onClick={() => setView('topics')}
        >
          <HelpCircle className="h-4 w-4" />
          Topics
        </Button>
      </div>

      <div className="flex-1 flex flex-col">
        {view === 'chat' ? (
          // Chat View - Only shows messages and input
          <>
            <div className="flex-1 overflow-y-auto min-h-[100%]">
              <ChatMessages messages={messages} />
            </div>
            <div className="p-4 border-t">
              <ChatInput onSendMessage={handleSendMessage} />
            </div>
          </>
        ) : (
          // Topics View - Shows categorized queries
          <div className="p-4 overflow-y-auto">
            <QuickQueries onQuerySelect={handleQuerySelect} isDropdown={false} />
          </div>
        )}
      </div>
    </div>
  );
} 