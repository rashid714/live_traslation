import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, FolderOpen, Download } from "lucide-react";

interface SessionItem {
  id: string;
  title: string;
  description: string | null;
  hostId: string;
  category: string;
  status: string;
  isLive: boolean;
  startTime: string;
  endTime: string | null;
  participantCount: number;
  languages: string[] | null;
}

interface TranscriptItem {
  id: string;
  sessionId: string;
  speakerId: string;
  text: string;
  language: string;
  timestamp: string;
  duration: number | null;
}

export default function Knowledge() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const { data: sessions = [] } = useQuery<SessionItem[]>({
    queryKey: ["/api/sessions"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  useEffect(() => {
    if (!selectedId && sessions.length > 0) {
      setSelectedId(sessions[0].id);
    }
  }, [sessions, selectedId]);

  const { data: transcripts = [] } = useQuery<TranscriptItem[]>({
    queryKey: ["/api/transcripts/session", selectedId ?? ""],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!selectedId,
  });

  const filtered = useMemo(
    () =>
      transcripts.filter((t) =>
        t.text.toLowerCase().includes(search.toLowerCase())
      ),
    [transcripts, search]
  );

  const handleExport = () => {
    const content = filtered.map((t) => `[${t.timestamp}] ${t.text}`).join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transcript_${selectedId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-full">
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b flex items-center gap-2">
          <FolderOpen className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Knowledge Base</h2>
        </div>
        <ScrollArea className="flex-1 p-2">
          <div className="space-y-2">
            {sessions.map((s) => (
              <Card
                key={s.id}
                className={`p-3 cursor-pointer ${selectedId === s.id ? "ring-2 ring-primary" : ""}`}
                onClick={() => setSelectedId(s.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{s.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{new Date(s.startTime).toLocaleString()}</p>
                  </div>
                  {s.isLive ? (
                    <Badge variant="destructive">LIVE</Badge>
                  ) : (
                    <Badge variant="secondary">{s.status}</Badge>
                  )}
                </div>
                {s.languages?.length ? (
                  <div className="mt-2 flex gap-1 flex-wrap">
                    {s.languages.map((l) => (
                      <Badge key={l} variant="outline" className="text-xxs">{l}</Badge>
                    ))}
                  </div>
                ) : null}
              </Card>
            ))}
            {sessions.length === 0 && (
              <p className="text-sm text-muted-foreground p-2">No saved sessions yet. Record in Speaker mode, then stop to save.</p>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transcript..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
          <Button variant="outline" size="sm" className="ml-auto" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3 max-w-4xl">
            {filtered.map((t) => (
              <div key={t.id} className="text-sm">
                <span className="text-xs text-muted-foreground mr-2">{t.timestamp}</span>
                <span>{t.text}</span>
              </div>
            ))}
            {selectedId && filtered.length === 0 && (
              <p className="text-sm text-muted-foreground">No transcript yet for this session.</p>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
