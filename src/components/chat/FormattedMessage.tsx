import React from 'react';
import { cn } from '../../lib/utils';
import { AssistantLogo } from '@/components/ui/assistant-logo';


interface FormattedMessageProps {
  text: string;
}

export function FormattedMessage({ text }: FormattedMessageProps) {
  // Function to process the text and split it into sections
  const processText = (text: string) => {
    return text.split('\n').map((line, index, array) => {
      // Handle headings (text between ** **)
      if (line.match(/\*\*(.*?)\*\*/)) {
        // Split the line into parts: before **, between **, and after **
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <h3 key={index} className={cn(
            "text-white text-base",
            index === 0 ? "mt-4 mb-2" : "mt-6 mb-2"
          )}>
            {parts.map((part, partIndex) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                // Remove ** and make this part bold
                return (
                  <strong key={partIndex}>
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return <span key={partIndex}>{part}</span>;
            })}
          </h3>
        );
      }
      
      // Handle bullet points (single *)
      if (line.trim().startsWith('*')) {
        const bulletText = line.trim().substring(1).trim();
        return (
          <div key={index} className="flex items-start space-x-3 my-2 pl-4">
            <span className="text-white mt-1.5" aria-hidden="true">•</span>
            <span className="text-white/90 flex-1 font-normal">
              {bulletText}
            </span>
          </div>
        );
      }

      // Regular text
      if (line.trim()) {
        return (
          <div key={index} className="text-white text-base mb-3 font-normal">
            {line}
          </div>
        );
      }

      // Empty lines
      return <div key={index} className="h-2" aria-hidden="true" />;
    });
  };

  return (
    <div className="space-y-1">
      {processText(text)}
    </div>
  );
} 