import { useState } from "react";
import { ChatList } from "@/components/chat-list";
import { MessageBubble } from "@/components/message-bubble";
import { ChatComposer } from "@/components/chat-composer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Languages } from "lucide-react";
import avatar1 from '@assets/generated_images/Asian_businesswoman_avatar_da0109c6.png';
import avatar2 from '@assets/generated_images/Middle_Eastern_businessman_avatar_22108a53.png';
import avatar3 from '@assets/generated_images/Hispanic_woman_avatar_6ade3757.png';

//todo: remove mock functionality
const mockChats = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: avatar1,
    lastMessage: 'Thanks for the meeting notes!',
    lastMessageTime: '2m ago',
    unreadCount: 2,
    isGroup: false,
    language: 'EN',
  },
  {
    id: '2',
    name: 'Product Team',
    avatar: avatar2,
    lastMessage: 'Ahmed: The presentation looks great',
    lastMessageTime: '15m ago',
    unreadCount: 5,
    isGroup: true,
    language: 'EN',
  },
  {
    id: '3',
    name: 'Maria Rodriguez',
    avatar: avatar3,
    lastMessage: '¡Muchas gracias!',
    lastMessageTime: '1h ago',
    unreadCount: 0,
    isGroup: false,
    language: 'ES',
  },
];

const mockMessages = [
  {
    id: '1',
    text: 'Hey, did you get my notes from the meeting?',
    senderName: 'Sarah Chen',
    senderAvatar: avatar1,
    timestamp: '2:30 PM',
    isOwn: false,
  },
  {
    id: '2',
    text: 'Yes, thank you! They were very helpful.',
    senderName: 'You',
    timestamp: '2:31 PM',
    isOwn: true,
  },
  {
    id: '3',
    text: '这个项目看起来很有前景',
    senderName: 'Sarah Chen',
    senderAvatar: avatar1,
    timestamp: '2:32 PM',
    isOwn: false,
    originalLanguage: 'ZH',
    translatedText: 'This project looks very promising',
  },
  {
    id: '4',
    text: 'I agree! Let\'s schedule a follow-up meeting next week.',
    senderName: 'You',
    timestamp: '2:33 PM',
    isOwn: true,
  },
];

export default function Chat() {
  const [selectedChatId, setSelectedChatId] = useState('1');
  const selectedChat = mockChats.find(c => c.id === selectedChatId);

  return (
    <div className="flex h-full">
      <div className="w-80 border-r flex flex-col bg-background">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Messages</h2>
        </div>
        <ChatList
          chats={mockChats}
          selectedId={selectedChatId}
          onSelectChat={setSelectedChatId}
        />
      </div>

      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="border-b p-4 bg-background">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedChat.avatar} />
                    <AvatarFallback>{selectedChat.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{selectedChat.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        <Languages className="h-3 w-3 mr-1" />
                        {selectedChat.language}
                      </Badge>
                      {selectedChat.isGroup && (
                        <span className="text-xs text-muted-foreground">
                          12 members
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost" data-testid="button-more-options" title="Conversation options">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4 max-w-4xl mx-auto">
                {mockMessages.map((message) => (
                  <MessageBubble key={message.id} {...message} />
                ))}
              </div>
            </ScrollArea>

            <ChatComposer
              onSendMessage={(message, language, isVoice) => {
                console.log('Sent message:', { message, language, isVoice });
              }}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
