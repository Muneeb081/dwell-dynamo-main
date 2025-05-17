import { Button } from '@/components/ui/button';
import { MessageSquare, List } from 'lucide-react';

type ChatMode = 'ai' | 'quick';

interface ChatHeaderProps {
  mode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
}

export function ChatHeader({ mode, onModeChange }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-background">
      <h2 className="text-lg font-semibold">Property Assistant</h2>
      <div className="flex gap-2">
        <Button
          variant={mode === 'ai' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onModeChange('ai')}
          className="gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          AI Chat
        </Button>
        <Button
          variant={mode === 'quick' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onModeChange('quick')}
          className="gap-2"
        >
          <List className="h-4 w-4" />
          Query-Based
        </Button>
      </div>
    </div>
  );
} 