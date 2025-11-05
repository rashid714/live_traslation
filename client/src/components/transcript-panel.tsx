import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface TranscriptEntry {
  id: string;
  speakerName: string;
  speakerAvatar?: string;
  text: string;
  timestamp: string;
  language: string;
  important?: boolean;
  followUp?: boolean;
}

interface TranscriptPanelProps {
  transcripts: TranscriptEntry[];
  selectedLanguage: string;
  onToggleImportant?: (id: string) => void;
  onToggleFollowUp?: (id: string) => void;
}

export function TranscriptPanel({ transcripts, selectedLanguage, onToggleImportant, onToggleFollowUp }: TranscriptPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTranscripts = transcripts.filter((t) =>
    t.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Live Transcript</h3>
          <Badge variant="outline">{selectedLanguage}</Badge>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transcript..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-transcript"
          />
        </div>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {filteredTranscripts.map((entry) => (
            <div key={entry.id} className="flex gap-3" data-testid={`transcript-entry-${entry.id}`}>
              <Avatar className="h-8 w-8">
                <AvatarImage src={entry.speakerAvatar} />
                <AvatarFallback>{entry.speakerName.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{entry.speakerName}</span>
                  <span className="text-xs text-muted-foreground">{entry.timestamp}</span>
                  {entry.important && <Badge variant="destructive">Important</Badge>}
                  {entry.followUp && <Badge variant="secondary">Follow-up</Badge>}
                </div>
                <p className="text-sm text-foreground">{entry.text}</p>
                {(onToggleImportant || onToggleFollowUp) && (
                  <div className="mt-2 flex gap-2">
                    {onToggleImportant && (
                      <Button size="sm" variant="outline" onClick={() => onToggleImportant(entry.id)}>
                        {entry.important ? "Unmark" : "Mark"} Important
                      </Button>
                    )}
                    {onToggleFollowUp && (
                      <Button size="sm" variant="outline" onClick={() => onToggleFollowUp(entry.id)}>
                        {entry.followUp ? "Clear" : "Add"} Follow-up
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" data-testid="button-export-transcript">
          Export
        </Button>
        <Button variant="outline" size="sm" className="flex-1" data-testid="button-share-transcript">
          Share
        </Button>
      </div>
    </div>
  );
}
