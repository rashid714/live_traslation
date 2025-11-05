import { useEffect, useMemo, useState } from "react";
import { TranscriptPanel } from "@/components/transcript-panel";
import { ParticipantList } from "@/components/participant-list";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { QrCode, Share2, Square, MessageSquare, ThumbsUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import avatar1 from '@assets/generated_images/Asian_businesswoman_avatar_da0109c6.png';
import avatar2 from '@assets/generated_images/Middle_Eastern_businessman_avatar_22108a53.png';
import avatar3 from '@assets/generated_images/Hispanic_woman_avatar_6ade3757.png';
import avatar4 from '@assets/generated_images/African_businessman_avatar_d7049125.png';
import { RecordingInterface } from "@/components/recording-interface";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

//todo: remove mock functionality
const mockTranscripts = [
  {
    id: '1',
    speakerName: 'Sarah Chen',
    speakerAvatar: avatar1,
    text: 'Welcome everyone to our Q4 product strategy meeting. Today we will discuss our roadmap and key initiatives.',
    timestamp: '00:00:12',
    language: 'EN',
  },
  {
    id: '2',
    speakerName: 'Ahmed Hassan',
    speakerAvatar: avatar2,
    text: 'Thank you Sarah. I would like to start by presenting our customer feedback analysis from the past quarter.',
    timestamp: '00:00:45',
    language: 'EN',
  },
  {
    id: '3',
    speakerName: 'Sarah Chen',
    speakerAvatar: avatar1,
    text: 'Excellent. Please go ahead with your presentation.',
    timestamp: '00:01:02',
    language: 'EN',
  },
];

const mockParticipants = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: avatar1,
    language: 'EN',
    isSpeaking: true,
    isMuted: false,
  },
  {
    id: '2',
    name: 'Ahmed Hassan',
    avatar: avatar2,
    language: 'AR',
    isSpeaking: false,
    isMuted: false,
  },
  {
    id: '3',
    name: 'Maria Rodriguez',
    avatar: avatar3,
    language: 'ES',
    isSpeaking: false,
    isMuted: true,
  },
  {
    id: '4',
    name: 'James Wilson',
    avatar: avatar4,
    language: 'EN',
    isSpeaking: false,
    isMuted: false,
  },
];

const mockQuestions = [
  {
    id: '1',
    question: 'How will this impact our timeline for the mobile app release?',
    asker: 'James Wilson',
    avatar: avatar4,
    upvotes: 12,
    isAnswered: false,
  },
  {
    id: '2',
    question: '¿Cuál es el presupuesto asignado para esta iniciativa?',
    asker: 'Maria Rodriguez',
    avatar: avatar3,
    upvotes: 8,
    isAnswered: true,
  },
];

export default function Speaker() {
  const [selectedLanguage, setSelectedLanguage] = useState("EN");
  const langForSR = useMemo(() => {
    switch (selectedLanguage) {
      case "ZH": return "zh";
      case "ES": return "es";
      case "AR": return "ar";
      default: return "en";
    }
  }, [selectedLanguage]);
  const { supported, isRecording, interimText, entries, start, stop } = useSpeechToText({ language: langForSR as any });
  const [importantIds, setImportantIds] = useState<Record<string, boolean>>({});
  const [followUpIds, setFollowUpIds] = useState<Record<string, boolean>>({});
  const [, navigate] = useLocation();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [title] = useState("Q4 Product Strategy Meeting");

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={avatar1} />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold">Q4 Product Strategy Meeting</h1>
                <p className="text-sm text-muted-foreground">Hosted by Sarah Chen</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isRecording && (
                <Badge variant="destructive" className="animate-pulse">
                  <div className="h-2 w-2 rounded-full bg-white mr-2" />
                  LIVE
                </Badge>
              )}
              <Badge variant="outline">{mockParticipants.length} participants</Badge>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-32" data-testid="select-transcript-language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EN">English</SelectItem>
                <SelectItem value="ZH">中文</SelectItem>
                <SelectItem value="ES">Español</SelectItem>
                <SelectItem value="AR">العربية</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" data-testid="button-share-qr">
              <QrCode className="h-4 w-4 mr-2" />
              QR Code
            </Button>
            <Button variant="outline" size="sm" data-testid="button-share-link">
              <Share2 className="h-4 w-4 mr-2" />
              Share Link
            </Button>
            {isRecording ? (
              <Button variant="destructive" size="sm" onClick={async () => {
                // stop recording and persist data
                stop();
                if (!sessionId) return;
                try {
                  // end session
                  await apiRequest("PATCH", `/api/sessions/${sessionId}`, {
                    isLive: false,
                    status: "ended",
                    endTime: new Date().toISOString(),
                  });
                  // save transcripts
                  for (const e of entries) {
                    await apiRequest("POST", "/api/transcripts", {
                      sessionId,
                      speakerId: "host-001",
                      text: [importantIds[e.id] ? "[IMPORTANT]" : null, followUpIds[e.id] ? "[FOLLOWUP]" : null, e.text]
                        .filter(Boolean)
                        .join(" "),
                      language: selectedLanguage,
                      timestamp: new Date().toISOString(),
                    });
                  }
                  navigate(`/knowledge`);
                } catch (err) {
                  console.error(err);
                }
              }} data-testid="button-end-session">
                <Square className="h-4 w-4 mr-2" />
                End Session
              </Button>
            ) : (
              <Button size="sm" onClick={async () => {
                // create a live session before starting so we have an id
                try {
                  const res = await apiRequest("POST", "/api/sessions", {
                    title,
                    description: "Live session recording",
                    hostId: "host-001",
                    category: "Meeting",
                    status: "live",
                    isLive: true,
                    startTime: new Date().toISOString(),
                    participantCount: 1,
                    languages: [selectedLanguage],
                  });
                  const created = await res.json();
                  setSessionId(created.id);
                  start();
                } catch (err) {
                  console.error(err);
                }
              }} data-testid="button-start-session">
                Start Session
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 border-r">
          <Tabs defaultValue="transcript" className="h-full flex flex-col">
            <TabsList className="mx-4 mt-4">
              <TabsTrigger value="transcript">Transcript</TabsTrigger>
              <TabsTrigger value="qa">Q&A ({mockQuestions.length})</TabsTrigger>
              <TabsTrigger value="discussion">Discussion</TabsTrigger>
            </TabsList>
            <TabsContent value="transcript" className="flex-1 mt-0">
              {!supported && (
                <div className="p-4 text-sm text-muted-foreground">
                  Your browser does not support real-time speech recognition. Try Chrome/Edge.
                </div>
              )}
              {supported && (
                <div className="h-full flex flex-col">
                  <div className="p-4 border-b text-sm text-muted-foreground">
                    {isRecording ? (interimText ? `Listening… ${interimText}` : "Listening…") : "Not recording"}
                  </div>
                  <TranscriptPanel
                    transcripts={entries.map((e) => ({
                      id: e.id,
                      speakerName: "You",
                      text: e.text,
                      timestamp: e.timestamp,
                      language: selectedLanguage,
                      important: !!importantIds[e.id],
                      followUp: !!followUpIds[e.id],
                    }))}
                    selectedLanguage={selectedLanguage}
                    onToggleImportant={(id) => setImportantIds((m) => ({ ...m, [id]: !m[id] }))}
                    onToggleFollowUp={(id) => setFollowUpIds((m) => ({ ...m, [id]: !m[id] }))}
                  />
                  <div className="border-t">
                    <RecordingInterface onStartRecording={start} onStopRecording={stop} />
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="qa" className="flex-1 mt-0 p-4 overflow-auto">
              <div className="space-y-4 max-w-4xl mx-auto">
                <QnA sessionId={sessionId} />
                {mockQuestions.map((q) => (
                  <Card key={q.id}>
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={q.avatar} />
                          <AvatarFallback>{q.asker.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{q.asker}</p>
                          <p className="text-sm mt-1">{q.question}</p>
                          <div className="flex items-center gap-3 mt-3">
                            <Button variant="ghost" size="sm">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              {q.upvotes}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Reply
                            </Button>
                            {q.isAnswered && (
                              <Badge variant="secondary">Answered</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="discussion" className="flex-1 mt-0 p-4">
              <p className="text-center text-muted-foreground">
                Discussion forum will be available after the session ends
              </p>
            </TabsContent>
          </Tabs>
        </div>

        <div className="w-80 bg-background">
          <ParticipantList participants={mockParticipants} />
        </div>
      </div>
    </div>
  );
}

function QnA({ sessionId }: { sessionId: string | null }) {
  const [question, setQuestion] = useState("");
  const { data: discussions = [], refetch } = useQuery<any[]>({
    queryKey: ["/api/discussions/session", sessionId ?? ""],
    queryFn: ({ queryKey }) => fetch(queryKey.join("/")).then((r) => r.ok ? r.json() : []),
    enabled: !!sessionId,
  });

  const submit = async () => {
    if (!sessionId || !question.trim()) return;
    await apiRequest("POST", "/api/discussions", {
      sessionId,
      userId: "guest-001",
      question: question.trim(),
      language: "EN",
      timestamp: new Date().toISOString(),
      upvotes: 0,
      isAnswered: false,
    });
    setQuestion("");
    refetch();
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2 text-sm bg-background"
          placeholder={sessionId ? "Ask a question…" : "Start session to enable Q&A"}
          disabled={!sessionId}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <Button size="sm" onClick={submit} disabled={!sessionId || !question.trim()}>Ask</Button>
      </div>
      {sessionId && (
        <div className="space-y-2">
          {discussions.map((d) => (
            <div key={d.id} className="text-sm p-3 border rounded">
              <div className="text-xs text-muted-foreground mb-1">{new Date(d.timestamp).toLocaleString()}</div>
              <div>{d.question}</div>
            </div>
          ))}
          {discussions.length === 0 && (
            <p className="text-sm text-muted-foreground">No questions yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
