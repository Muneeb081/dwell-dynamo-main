import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { chatbotResponses, predefinedQueries } from '@/lib/data';
import { Send, Bot, Home, User, HelpCircle, MessageSquare, Building, MapPin, BarChart, Loader2, Settings, BrainCircuit, ShoppingBag, Key, Coins, DollarSign, TrendingUp } from 'lucide-react';
import { Message, SuggestedQuery } from '@/lib/types';
import { generateAIResponse } from '@/lib/gemini';
import { AssistantLogo } from '@/components/ui/assistant-logo';
import { toast } from '@/components/ui/use-toast';
import { generateLocalResponse } from '@/lib/localChatbot';
import { Switch } from '@/components/ui/switch';
import { FormattedMessage } from '@/components/chat/FormattedMessage';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const suggestedQueries: SuggestedQuery[] = [
  // Buying category
  { id: 'buying-process', text: 'How to buy property in Islamabad?', category: 'buying' },
  { id: 'buying-tips', text: 'What should I check before buying?', category: 'buying' },
  { id: 'buying-finance', text: 'How can I finance my property purchase?', category: 'buying' },
  { id: 'buying-documents', text: 'What documents are needed for property purchase?', category: 'buying' },
  { id: 'buying-inspection', text: 'How to inspect property before buying?', category: 'buying' },
  { id: 'buying-negotiation', text: 'Tips for negotiating property price?', category: 'buying' },
  
  // Renting category
  { id: 'renting-process', text: 'Process for renting a property?', category: 'renting' },
  { id: 'renting-tips', text: 'Tips for first-time renters?', category: 'renting' },
  { id: 'renting-documents', text: 'Documents needed for renting?', category: 'renting' },
  { id: 'renting-inspection', text: 'What to check before renting a property?', category: 'renting' },
  { id: 'renting-agreement', text: 'How to draft a rental agreement?', category: 'renting' },
  { id: 'renting-deposit', text: 'Standard security deposit amounts?', category: 'renting' },
  
  // Investment category
  { id: 'investment-advice', text: 'Best property investment areas?', category: 'investment' },
  { id: 'investment-returns', text: 'Expected returns on property investment?', category: 'investment' },
  { id: 'investment-hotspots', text: 'Current investment hotspots?', category: 'investment' },
  { id: 'investment-commercial', text: 'Commercial vs residential investment?', category: 'investment' },
  { id: 'investment-risks', text: 'Risks in real estate investment?', category: 'investment' },
  { id: 'investment-appreciation', text: 'Areas with highest appreciation?', category: 'investment' },
  
  // Property rates category
  { id: 'rates-f-sectors', text: 'Property rates in F sectors?', category: 'rates' },
  { id: 'rates-e-sectors', text: 'Property rates in E sectors?', category: 'rates' },
  { id: 'rates-bahria', text: 'Property rates in Bahria Town?', category: 'rates' },
  { id: 'rates-dha', text: 'Property rates in DHA?', category: 'rates' },
  { id: 'rates-gulberg', text: 'Property rates in Gulberg?', category: 'rates' },
  { id: 'rates-bani-gala', text: 'Property rates in Bani Gala?', category: 'rates' },
  { id: 'rates-g-sectors', text: 'Property rates in G sectors?', category: 'rates' },
  { id: 'rates-i-sectors', text: 'Property rates in I sectors?', category: 'rates' },
  
  // Market trends
  { id: 'trends-current', text: 'Current real estate market trends?', category: 'trends' },
  { id: 'trends-forecast', text: 'Real estate market forecast?', category: 'trends' },
  { id: 'trends-investment', text: 'Best time to invest in property?', category: 'trends' },
  { id: 'trends-areas', text: 'Up-and-coming areas in Islamabad?', category: 'trends' },
];

const PropertyChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Hello! I\'m your property assistant powered by AI. How can I help you today? You can ask me about buying, renting, investment advice, or property rates in Islamabad.',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useAI, setUseAI] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showQueries, setShowQueries] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const queryTimeoutRef = useRef<NodeJS.Timeout>();
  const queriesRef = useRef<HTMLDivElement>(null);
  
 
  

  
  const handleSendMessage = async (text: string = input) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      let botResponse: string;
      
      if (useAI) {
        // Get response from Gemini API
        botResponse = await generateAIResponse(text);
      } else {
        // Use local response generation with suggestedQueries
        const matchingQuery = suggestedQueries.find(q => 
          text.toLowerCase().includes(q.text.toLowerCase())
        );
        
        // if (matchingQuery) {
        //   botResponse = generateLocalResponse(text, chatbotResponses);
        // } else {
        //   botResponse = "I'm not sure about that. Could you try asking about buying, renting, investment advice, or property rates in Islamabad? You can also ask about current market trends or specific areas.";
        // }
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botResponse,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting bot response:', error);
      toast({
        title: "Connection Error",
        description: "Could not generate a response. Using local data instead.",
        variant: "destructive",
      });
      
      // Fallback to local response system
      const fallbackResponse = generateLocalResponse(text, chatbotResponses);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: fallbackResponse,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSuggestedQuery = (query: string) => {
    setInput(query);
    handleSendMessage(query);
  };

  const handleInputFocus = () => {
    setShowQueries(true);
    if (queryTimeoutRef.current) {
      clearTimeout(queryTimeoutRef.current);
    }
  };

  const handleInputBlur = (e: React.FocusEvent) => {
    // Check if the click is within the queries section
    if (queriesRef.current?.contains(e.relatedTarget as Node)) {
      return;
    }
    
    queryTimeoutRef.current = setTimeout(() => {
      setShowQueries(false);
      setSelectedCategory(null);
    }, 500);
  };

  const categories = [
    { id: 'buying', label: 'Buying', icon: ShoppingBag },
    { id: 'renting', label: 'Renting', icon: Key },
    { id: 'investment', label: 'Investment', icon: Coins },
    { id: 'rates', label: 'Rates', icon: DollarSign },
    { id: 'trends', label: 'Trends', icon: TrendingUp }
  ];

  const filteredQueries = selectedCategory
    ? suggestedQueries.filter(q => q.category === selectedCategory)
    : suggestedQueries;

  return (
    <Card className="shadow-md border-gray-800 bg-gray-900 text-white">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-gray-800">
        <CardTitle className="flex items-center text-lg text-white justify-between">
          <div className="flex items-center">
            <AssistantLogo size={20} className="mr-2" />
            Property Assistant
          </div>
          <div className="flex items-center space-x-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800">
                  <Settings size={16} />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-gray-900 text-white border-gray-800">
                <SheetHeader>
                  <SheetTitle className="text-white">Assistant Settings</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 mt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        <BrainCircuit className="mr-2 h-4 w-4 text-teal-400" />
                        <span className="font-medium">Use AI</span>
                      </div>
                      <p className="text-sm text-gray-400">
                        Toggle between AI and local responses
                      </p>
                    </div>
                    <Switch
                      checked={useAI}
                      onCheckedChange={setUseAI}
                      className="data-[state=checked]:bg-teal-600"
                    />
                  </div>
                  
                  <div className="rounded-lg bg-gray-800 p-4 text-sm">
                    <p className="text-gray-300">
                      {useAI 
                        ? "The assistant is using AI to generate responses. This provides more accurate and contextual answers but requires an API key."
                        : "The assistant is using local responses. These are pre-defined answers that may be less specific but don't require an API connection."
                      }
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </CardTitle>
      </CardHeader>
      
      <Tabs defaultValue="chat" className="flex flex-col max-h-[700px]">
        <TabsList className="grid grid-cols-2 mx-4 mb-2 bg-gray-800">
          <TabsTrigger value="chat" className="flex items-center data-[state=active]:text-white data-[state=active]:bg-gray-700">
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="topics" className="flex items-center data-[state=active]:text-white data-[state=active]:bg-gray-700">
            <HelpCircle className="h-4 w-4 mr-2" />
            Topics
          </TabsTrigger>
        </TabsList>
        <ScrollArea className=" p-4 overflow-y-scroll scrollbar max-h-[400px] min-h-[300px] border-[1px] border-foreground bg-gray-950">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`flex max-w-[85%] ${
                      message.sender === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <Avatar className={`h-8 w-8 ${message.sender === 'user' ? 'ml-2' : 'mr-2'} bg-gray-800`}>
                      {message.sender === 'user' ? (
                        <AvatarImage src="/placeholder.svg" />
                      ) : (
                        <AssistantLogo size={32} />
                      )}
                      <AvatarFallback className={message.sender === 'user' ? 'bg-teal-700' : 'bg-gray-700'}>
                        {message.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`rounded-lg p-3 relative ${
                        message.sender === 'user'
                          ? 'bg-teal-600 text-white'
                          : 'bg-gray-800 text-white'
                      }`}
                    >
                      {message.sender === 'bot' && (
                        <div className="absolute -left-2 -top-2">
                          <AssistantLogo size={16} />
                        </div>
                      )}
                      <div className="text-sm whitespace-pre-wrap">
                        <FormattedMessage text={message.text} />
                      </div>
                      <span className="text-xs opacity-70 block mt-1">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex max-w-[85%]">
                    <Avatar className="h-8 w-8 mr-2 bg-gray-800">
                      <AssistantLogo size={32} />
                      <AvatarFallback className="bg-gray-700">
                        <Bot size={14} />
                      </AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg p-3 bg-gray-800 text-white relative">
                      <div className="absolute -left-2 -top-2">
                        <AssistantLogo size={16} />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <p className="text-sm">{useAI ? "AI thinking..." : "Thinking..."}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        <TabsContent value="chat" className="flex-1  flex-col m-0 p-0 h-full data-[state=active]:flex none overflow-hidden">
          <div className="p-4 border-t border-gray-800 bg-gray-900">
            <div className="flex gap-2">
              <Input
                placeholder="Type your question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
                className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                disabled={isLoading}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={() => handleSendMessage()} 
                      size="icon" 
                      className="bg-teal-600 hover:bg-teal-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Send Message</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            {showQueries && (
              <div ref={queriesRef} className="mt-4 space-y-4 ">
                <div className="flex space-x-3 overflow-y-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 ">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        size="lg"
                        className={`min-w-[120px] whitespace-nowrap transition-all duration-200 ${
                          selectedCategory === category.id
                            ? "bg-teal-600 hover:bg-teal-700 text-white shadow-lg"
                            : "bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:border-teal-500"
                        }`}
                        onClick={() => setSelectedCategory(
                          selectedCategory === category.id ? null : category.id
                        )}
                      >
                        <Icon className="h-5 w-5 mr-2" />
                        {category.label}
                      </Button>
                    );
                  })}
                </div>
                
                <div className="overflow-x-auto scrollbar ">
                  <div className="flex flex-wrap h-40 gap-3  pb-2">
                    {filteredQueries.map((query) => (
                      <Button
                        key={query.id}
                        variant="outline"
                        size="lg"
                        className="min-w-[200px] bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:border-teal-500 transition-all duration-200 text-left justify-start px-4 py-2"
                        onClick={() => handleSuggestedQuery(query.text)}
                      >
                        {query.text}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-2 mt-2">
              <BrainCircuit size={14} className={useAI ? "text-teal-400" : "text-gray-500"} />
              <span className="text-xs text-gray-400">
                {useAI ? "AI-powered responses" : "Local responses"}
              </span>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="topics" className="flex-1 m-0 p-0 overflow-y-scroll scrollbar  data-[state=active]:block none ">
          <ScrollArea className="h-full p-4 bg-gray-950">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold flex items-center mb-3 text-white">
                  <Home className="h-5 w-5 mr-2 text-teal-400" />
                  Buying Property
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {suggestedQueries
                    .filter((q) => q.category === 'buying')
                    .map((query) => (
                      <Button
                        key={query.id}
                        variant="outline"
                        className="justify-start h-auto py-2 px-3 text-left border-gray-700 bg-gray-800 hover:bg-gray-700 text-white"
                        onClick={() => handleSuggestedQuery(query.text)}
                        disabled={isLoading}
                      >
                        {query.text}
                      </Button>
                    ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold flex items-center mb-3 text-white">
                  <Home className="h-5 w-5 mr-2 text-teal-400" />
                  Renting Property
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {suggestedQueries
                    .filter((q) => q.category === 'renting')
                    .map((query) => (
                      <Button
                        key={query.id}
                        variant="outline"
                        className="justify-start h-auto py-2 px-3 text-left border-gray-700 bg-gray-800 hover:bg-gray-700 text-white"
                        onClick={() => handleSuggestedQuery(query.text)}
                        disabled={isLoading}
                      >
                        {query.text}
                      </Button>
                    ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold flex items-center mb-3 text-white">
                  <Building className="h-5 w-5 mr-2 text-teal-400" />
                  Investment Advice
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {suggestedQueries
                    .filter((q) => q.category === 'investment')
                    .map((query) => (
                      <Button
                        key={query.id}
                        variant="outline"
                        className="justify-start h-auto py-2 px-3 text-left border-gray-700 bg-gray-800 hover:bg-gray-700 text-white"
                        onClick={() => handleSuggestedQuery(query.text)}
                        disabled={isLoading}
                      >
                        {query.text}
                      </Button>
                    ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold flex items-center mb-3 text-white">
                  <MapPin className="h-5 w-5 mr-2 text-teal-400" />
                  Property Rates
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {suggestedQueries
                    .filter((q) => q.category === 'rates')
                    .map((query) => (
                      <Button
                        key={query.id}
                        variant="outline"
                        className="justify-start h-auto py-2 px-3 text-left border-gray-700 bg-gray-800 hover:bg-gray-700 text-white"
                        onClick={() => handleSuggestedQuery(query.text)}
                        disabled={isLoading}
                      >
                        {query.text}
                      </Button>
                    ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold flex items-center mb-3 text-white">
                  <BarChart className="h-5 w-5 mr-2 text-teal-400" />
                  Market Trends
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {suggestedQueries
                    .filter((q) => q.category === 'trends')
                    .map((query) => (
                      <Button
                        key={query.id}
                        variant="outline"
                        className="justify-start h-auto py-2 px-3 text-left border-gray-700 bg-gray-800 hover:bg-gray-700 text-white"
                        onClick={() => handleSuggestedQuery(query.text)}
                        disabled={isLoading}
                      >
                        {query.text}
                      </Button>
                    ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="px-4 py-2 border-t border-gray-800 bg-gray-900 flex justify-between text-xs text-gray-400">
        <span>{useAI ? "AI-powered" : "Local Data"}</span>
        <div className="flex items-center">
          <AssistantLogo size={12} className="mr-1" />
          <span>Property Expert v1.0</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PropertyChatbot;
