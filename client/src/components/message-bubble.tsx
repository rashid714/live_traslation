import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, ChevronDown } from "lucide-react";
import { useState } from "react";

interface MessageBubbleProps {
  id: string;
  text: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: string;
  isOwn: boolean;
  isVoiceMessage?: boolean;
  originalLanguage?: string;
  translatedText?: string;
}

export function MessageBubble({
  text,
  senderName,
  senderAvatar,
  timestamp,
  isOwn,
  isVoiceMessage,
  originalLanguage,
  translatedText,
}: MessageBubbleProps) {
  const [showTranslation, setShowTranslation] = useState(false);

  return (
    <div className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}>
      {!isOwn && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={senderAvatar} />
          <AvatarFallback>{senderName.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      )}
      <div className={`flex flex-col gap-1 max-w-md ${isOwn ? "items-end" : ""}`}>
        {!isOwn && <p className="text-xs text-muted-foreground px-3">{senderName}</p>}
        <div
          className={`rounded-2xl px-4 py-2 ${
            isOwn
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground"
          }`}
        >
          {isVoiceMessage && (
            <div className="flex items-center gap-2 mb-1">
              <Mic className="h-3 w-3" />
              <span className="text-xs">Voice message</span>
            </div>
          )}
          <p className="text-sm">{text}</p>
          {originalLanguage && translatedText && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-1 h-auto p-0 text-xs hover:bg-transparent"
              onClick={() => setShowTranslation(!showTranslation)}
              data-testid="button-toggle-translation"
            >
              <ChevronDown className={`h-3 w-3 mr-1 transition-transform ${showTranslation ? "rotate-180" : ""}`} />
              {showTranslation ? "Hide" : "Show"} translation
            </Button>
          )}
          {showTranslation && translatedText && (
            <div className="mt-2 pt-2 border-t border-current/20">
              <Badge variant="outline" className="mb-1 text-xs">
                {originalLanguage}
              </Badge>
              <p className="text-sm opacity-80">{translatedText}</p>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground px-3">{timestamp}</p>
      </div>
    </div>
  );
}
