
import { Bot } from 'lucide-react';

interface AssistantLogoProps {
  size?: number;
  className?: string;
}

export const AssistantLogo = ({ size = 20, className = '' }: AssistantLogoProps) => {
  return (
    <div className={`rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center ${className}`}
         style={{ width: size, height: size }}>
      <Bot className="text-white" size={size * 0.7} />
    </div>
  );
};
