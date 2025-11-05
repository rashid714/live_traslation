import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mic, MicOff } from "lucide-react";

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  language: string;
  isSpeaking: boolean;
  isMuted: boolean;
}

interface ParticipantListProps {
  participants: Participant[];
}

export function ParticipantList({ participants }: ParticipantListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Participants ({participants.length})</h3>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                participant.isSpeaking ? "bg-accent ring-2 ring-primary" : ""
              }`}
              data-testid={`participant-${participant.id}`}
            >
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={participant.avatar} />
                  <AvatarFallback>{participant.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                {participant.isSpeaking && (
                  <div className="absolute -inset-1 rounded-full border-2 border-primary animate-pulse" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{participant.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {participant.language}
                  </Badge>
                  {participant.isMuted ? (
                    <MicOff className="h-3 w-3 text-muted-foreground" />
                  ) : (
                    <Mic className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
