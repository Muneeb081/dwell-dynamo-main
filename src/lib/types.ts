
export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export interface SuggestedQuery {
  id: string;
  text: string;
  category: 'buying' | 'renting' | 'investment' | 'rates' | 'trends';
}

export interface ChatbotResponses {
  buying: Record<string, string>;
  renting: Record<string, string>;
  investment: Record<string, string>;
  rates: Record<string, string>;
  [key: string]: Record<string, string>;
}
