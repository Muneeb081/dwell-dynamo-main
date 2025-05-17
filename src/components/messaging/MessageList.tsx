
  import { useState, useEffect } from 'react';
  import { useAuth } from '@/contexts/AuthContext';
  import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
  import { ScrollArea } from '@/components/ui/scroll-area';
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
  import { getMessages, sendMessage, markAsRead } from '@/lib/data';
  import { formatDistanceToNow } from 'date-fns';
  import { MessageSquare, Send } from 'lucide-react';

  interface Message {
    id: string;
    senderId: string;
    senderName: string;
    senderImage?: string;
    receiverId: string;
    receiverName: string;
    receiverImage?: string;
    content: string;
    createdAt: string;
    read: boolean;
    propertyId?: string;
    propertyTitle?: string;
  }

  interface ConversationProps {
    conversation: Message[];
    otherUserId: string;
    otherUserName: string;
    otherUserImage?: string;
    onSendMessage: (message: string, receiverId: string) => void;
  }

  const Conversation = ({ conversation, otherUserId, otherUserName, otherUserImage, onSendMessage }: ConversationProps) => {
    const [newMessage, setNewMessage] = useState('');
    const { user } = useAuth();

    const handleSendMessage = () => {
      if (newMessage.trim() && user) {
        onSendMessage(newMessage.trim(), otherUserId);
        setNewMessage('');
      }
    };

    return (
        <div className="flex flex-col h-[50vh]">
          <div className="p-4 border-b flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={otherUserImage} alt={otherUserName} />
              <AvatarFallback>{otherUserName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{otherUserName}</h3>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {conversation.map((msg) => (

                  <div
                      key={msg.id}
                      className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                            msg.senderId === user?.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                        }`}
                    >
                      {msg.propertyId && (
                          <div className="text-xs mb-1 underline">
                            Re: <a href={`/property/${msg.propertyId._id}`}> {msg.propertyId.title}</a>
                          </div>
                      )}
                      <p>{msg.content}</p>
                      <div className="text-xs mt-1 opacity-70">
                        {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t mt-auto">
            <div className="flex items-center space-x-2">
              <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
              />
              <Button size="icon" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
    );
  };

  const MessageList = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [activeTab, setActiveTab] = useState('inbox');
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (user) {
        loadMessages();
      }
    }, [user]);

    const loadMessages = async () => {
      setLoading(true);
      try {
        if (user) {
          const result = await getMessages(user.id);
          setMessages(result);

        }
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setLoading(false);
      }
    };

    const handleSendMessage = async (message: string, receiverId: string) => {
      if (!user || !message.trim()) return;

      try {
        await sendMessage({
          senderId: user.id,
          receiverId,
          content: message.trim(),
        });

        // Reload messages after sending
        loadMessages();
      } catch (error) {
        console.error('Error sending message:', error);
      }
    };

    const markConversationAsRead = async (otherUserId: string) => {

      if (!user) return;

      try {
        await markAsRead(user.id, otherUserId);
        loadMessages();
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    };

    // Group messages by conversation
    const conversations = messages.reduce((acc, message) => {
      const otherUserId = message.senderId._id === user?.id ? message.receiverId._id : message.senderId._id;

      if (!acc[otherUserId]) {
        acc[otherUserId] = {
          otherUserId,
          otherUserName: message.senderId._id  === user?.id ? message.receiverId.name : message.senderId.name,
          otherUserImage: message.senderId._id  === user?.id ?message.receiverId.image : message.senderId.image,
          messages: [],
          lastMessageAt: new Date(0),
          unreadCount: 0
        };
      }

      acc[otherUserId].messages.push(message);

      const messageDate = new Date(message.createdAt);
      if (messageDate > acc[otherUserId].lastMessageAt) {
        acc[otherUserId].lastMessageAt = messageDate;
      }

      if (message.senderId !== user?.id && !message.read) {
        acc[otherUserId].unreadCount++;
      }

      return acc;
    }, {} as Record<string, {
      otherUserId: string;
      otherUserName: string;
      otherUserImage?: string;
      messages: Message[];
      lastMessageAt: Date;
      unreadCount: number;
    }>);

    // Sort conversations by last message time
    const sortedConversations = Object.values(conversations).sort((a, b) =>
        b.lastMessageAt.getTime() - a.lastMessageAt.getTime()
    );

    // Filter based on active tab
    const filteredConversations = activeTab === 'unread'
        ? sortedConversations.filter(c => c.unreadCount > 0)
        : sortedConversations;

    const selectedConversationData = selectedConversation
        ? conversations[selectedConversation]
        : null;
    return (
        <div className="flex flex-col h-full">
          <Tabs defaultValue="inbox" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="inbox">All Messages</TabsTrigger>
                <TabsTrigger value="unread">
                  Unread
                  {Object.values(conversations).reduce((count, conv) => count + conv.unreadCount, 0) > 0 && (
                      <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
                    {Object.values(conversations).reduce((count, conv) => count + conv.unreadCount, 0)}
                  </span>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="inbox" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border rounded-lg overflow-hidden mt-4">
                <div className="border-r">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold">Conversations</h3>
                  </div>
                  <ScrollArea className="h-[50vh]">
                    {loading ? (
                        <div className="p-8 text-center text-muted-foreground">Loading conversations...</div>
                    ) : filteredConversations.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">No messages found</div>
                    ) : (
                        filteredConversations.map((conversation) => (
                            <div
                                key={conversation.otherUserId}
                                className={`p-4 border-b cursor-pointer transition-colors ${
                                    selectedConversation === conversation.otherUserId
                                        ? 'bg-muted'
                                        : 'hover:bg-muted/50'
                                }`}
                                onClick={() => {
                                  setSelectedConversation(conversation.otherUserId);
                                  if (conversation.unreadCount > 0) {
                                    markConversationAsRead(conversation.otherUserId);
                                  }
                                }}
                            >
                              <div className="flex items-center space-x-3">
                                <Avatar>
                                  <AvatarImage src={conversation.otherUserImage} alt={conversation.otherUserName} />
                                  <AvatarFallback>{conversation.otherUserName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-center">
                                    <h4 className="font-medium truncate">{conversation.otherUserName}</h4>
                                    <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(conversation.lastMessageAt, { addSuffix: true })}
                              </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground truncate">
                                    {conversation.messages[conversation.messages.length - 1].message}
                                  </p>
                                </div>
                                {conversation.unreadCount > 0 && (
                                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
                              {conversation.unreadCount}
                            </span>
                                )}
                              </div>
                            </div>
                        ))
                    )}
                  </ScrollArea>
                </div>

                <div className="col-span-2">
                  {selectedConversationData ? (
                      <Conversation
                          conversation={selectedConversationData.messages}
                          otherUserId={selectedConversationData.otherUserId}
                          otherUserName={selectedConversationData.otherUserName}
                          otherUserImage={selectedConversationData.otherUserImage}
                          onSendMessage={handleSendMessage}
                      />
                  ) : (
                      <div className="h-[50vh] flex flex-col items-center justify-center text-muted-foreground">
                        <MessageSquare className="h-12 w-12 mb-4" />
                        <p>Select a conversation to start messaging</p>
                      </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="unread" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border rounded-lg overflow-hidden mt-4">
                <div className="border-r">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold">Unread Conversations</h3>
                  </div>
                  <ScrollArea className="h-[50vh]">
                    {loading ? (
                        <div className="p-8 text-center text-muted-foreground">Loading unread messages...</div>
                    ) : filteredConversations.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">No unread messages</div>
                    ) : (
                        filteredConversations.map((conversation) => (
                            <div
                                key={conversation.otherUserId}
                                className={`p-4 border-b cursor-pointer transition-colors ${
                                    selectedConversation === conversation.otherUserId
                                        ? 'bg-muted'
                                        : 'hover:bg-muted/50'
                                }`}
                                onClick={() => {
                                  setSelectedConversation(conversation.otherUserId);
                                  markConversationAsRead(conversation.otherUserId);
                                }}
                            >
                              <div className="flex items-center space-x-3">
                                <Avatar>
                                  <AvatarImage src={conversation.otherUserImage} alt={conversation.otherUserName} />
                                  <AvatarFallback>{conversation.otherUserName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-center">
                                    <h4 className="font-medium truncate">{conversation.otherUserName}</h4>
                                    <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(conversation.lastMessageAt, { addSuffix: true })}
                              </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground truncate">
                                    {conversation.messages[conversation.messages.length - 1].message}
                                  </p>
                                </div>
                                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
                            {conversation.unreadCount}
                          </span>
                              </div>
                            </div>
                        ))
                    )}
                  </ScrollArea>
                </div>

                <div className="col-span-2">
                  {selectedConversationData ? (
                      <Conversation
                          conversation={selectedConversationData.messages}
                          otherUserId={selectedConversationData.otherUserId}
                          otherUserName={selectedConversationData.otherUserName}
                          otherUserImage={selectedConversationData.otherUserImage}
                          onSendMessage={handleSendMessage}
                      />
                  ) : (
                      <div className="h-[50vh] flex flex-col items-center justify-center text-muted-foreground">
                        <MessageSquare className="h-12 w-12 mb-4" />
                        <p>Select a conversation to start messaging</p>
                      </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
    );
  };

  export default MessageList;
