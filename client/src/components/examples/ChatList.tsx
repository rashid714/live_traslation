import { ChatList } from '../chat-list';
import { useState } from 'react';
import avatar1 from '@assets/generated_images/Asian_businesswoman_avatar_da0109c6.png';
import avatar2 from '@assets/generated_images/Middle_Eastern_businessman_avatar_22108a53.png';
import avatar3 from '@assets/generated_images/Hispanic_woman_avatar_6ade3757.png';

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

export default function ChatListExample() {
  const [selectedId, setSelectedId] = useState('1');

  return (
    <div className="h-96 w-80 border rounded-lg bg-background">
      <ChatList
        chats={mockChats}
        selectedId={selectedId}
        onSelectChat={(id) => {
          console.log('Selected chat:', id);
          setSelectedId(id);
        }}
      />
    </div>
  );
}
