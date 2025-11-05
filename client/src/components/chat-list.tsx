import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Chat {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isGroup: boolean;
  language: string;
}

interface ChatListProps {
  chats: Chat[];
  selectedId?: string;
  onSelectChat: (id: string) => void;
}

export function ChatList({ chats, selectedId, onSelectChat }: ChatListProps) {
  return (
    <ScrollArea className="flex-1">
      <div className="space-y-1 p-2">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`w-full flex items-start gap-3 p-3 rounded-lg hover-elevate active-elevate-2 text-left ${
              selectedId === chat.id ? "bg-accent" : ""
            }`}
            data-testid={`button-chat-${chat.id}`}
          >
            <Avatar className="h-12 w-12">
              <AvatarImage src={chat.avatar} />
              <AvatarFallback>{chat.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="font-medium truncate">{chat.name}</p>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {chat.lastMessageTime}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                {chat.unreadCount > 0 && (
                  <Badge variant="default" className="shrink-0">
                    {chat.unreadCount}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {chat.language}
                </Badge>
                {chat.isGroup && (
                  <Badge variant="secondary" className="text-xs">
                    Group
                  </Badge>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
