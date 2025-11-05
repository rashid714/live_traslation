import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, Square, Pause, Play } from "lucide-react";
import { useState } from "react";

interface RecordingInterfaceProps {
  onStartRecording?: () => void;
  onStopRecording?: () => void;
}

export function RecordingInterface({ onStartRecording, onStopRecording }: RecordingInterfaceProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);

  const handleStartStop = () => {
    if (isRecording) {
      setIsRecording(false);
      setIsPaused(false);
      onStopRecording?.();
      console.log('Recording stopped');
    } else {
      setIsRecording(true);
      onStartRecording?.();
      console.log('Recording started');
    }
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
    console.log(isPaused ? 'Recording resumed' : 'Recording paused');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-12">
      <div className="relative">
        <Button
          size="icon"
          variant={isRecording ? "destructive" : "default"}
          className="h-32 w-32 rounded-full"
          onClick={handleStartStop}
          data-testid="button-record-toggle"
        >
          {isRecording ? (
            <Square className="h-12 w-12" />
          ) : (
            <Mic className="h-12 w-12" />
          )}
        </Button>
        {isRecording && (
          <div className="absolute -inset-4 rounded-full border-4 border-destructive animate-pulse" />
        )}
      </div>

      <div className="text-center space-y-2">
        <div className="text-4xl font-mono font-bold">{formatTime(duration)}</div>
        {isRecording && (
          <Badge variant={isPaused ? "secondary" : "destructive"}>
            {isPaused ? "Paused" : "Recording"}
          </Badge>
        )}
      </div>

      {isRecording && (
        <Button
          variant="outline"
          onClick={handlePauseResume}
          data-testid="button-pause-resume"
        >
          {isPaused ? (
            <>
              <Play className="h-4 w-4 mr-2" />
              Resume
            </>
          ) : (
            <>
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </>
          )}
        </Button>
      )}

      <div className="w-full max-w-md h-16 bg-muted rounded-lg flex items-center justify-center">
        <div className="flex items-end gap-1 h-8">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="w-1 bg-primary rounded-full transition-all"
              style={{
                height: isRecording && !isPaused ? `${Math.random() * 100}%` : '20%',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
