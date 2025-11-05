import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Send, Languages } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChatComposerProps {
  onSendMessage: (message: string, language: string, isVoice: boolean) => void;
}

export function ChatComposer({ onSendMessage }: ChatComposerProps) {
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState("en");
  const [isRecording, setIsRecording] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message, language, false);
      setMessage("");
    }
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      console.log('Started voice recording');
    } else {
      console.log('Stopped voice recording');
      onSendMessage("Voice message recorded", language, true);
    }
  };

  return (
    <div className="border-t p-4 bg-background">
      <div className="flex items-center gap-2 mb-2">
        <Languages className="h-4 w-4 text-muted-foreground" />
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-32 h-8" data-testid="select-language">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="zh">中文</SelectItem>
            <SelectItem value="es">Español</SelectItem>
            <SelectItem value="ar">العربية</SelectItem>
            <SelectItem value="ur">اردو</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-end gap-2">
        <Textarea
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="min-h-[60px] resize-none"
          data-testid="input-message"
        />
        <div className="flex flex-col gap-2">
          <Button
            size="icon"
            variant={isRecording ? "destructive" : "secondary"}
            onClick={handleVoiceRecord}
            data-testid="button-voice-record"
          >
            <Mic className={`h-5 w-5 ${isRecording ? "animate-pulse" : ""}`} />
          </Button>
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!message.trim()}
            data-testid="button-send-message"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
