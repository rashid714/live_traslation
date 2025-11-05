import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Send, Languages } from "lucide-react";
import { useEffect, useState } from "react";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
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
  const { supported, isRecording: srRecording, interimText, entries, start, stop } = useSpeechToText({ language: language as any });

  useEffect(() => {
    if (!supported) return;
    if (srRecording) {
      // show interim in the input for immediate feedback
      if (interimText) setMessage(interimText);
      // when a final entry is produced, populate the input with it
      if (entries.length > 0) {
        const last = entries[entries.length - 1];
        setMessage(last.text);
      }
    }
  }, [supported, srRecording, interimText, entries]);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message, language, false);
      setMessage("");
    }
  };

  const handleVoiceRecord = () => {
    if (!supported) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const next = !isRecording;
    setIsRecording(next);
    if (next) {
      start();
    } else {
      stop();
      if (message.trim()) {
        onSendMessage(message.trim(), language, true);
        setMessage("");
      }
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
