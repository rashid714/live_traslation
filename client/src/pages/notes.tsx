import { useState } from "react";
import { RecordingInterface } from "@/components/recording-interface";
import { NoteEditor } from "@/components/note-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, FileText, Mic } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

//todo: remove mock functionality
const mockNotes = [
  {
    id: '1',
    title: 'Q4 Strategy Meeting Notes',
    preview: 'Key discussion points: 1. Roadmap priorities 2. Customer feedback...',
    format: 'meeting-minutes',
    date: '2 hours ago',
    duration: '45 min',
  },
  {
    id: '2',
    title: 'Machine Learning Lecture - Neural Networks',
    preview: 'Introduction to neural networks and their applications in modern ML systems...',
    format: 'lecture',
    date: 'Yesterday',
    duration: '90 min',
  },
  {
    id: '3',
    title: 'Project Planning Session',
    preview: 'Timeline overview, resource allocation, milestone definitions...',
    format: 'meeting-minutes',
    date: '2 days ago',
    duration: '30 min',
  },
];

export default function Notes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("record");
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const filteredNotes = mockNotes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedNote = mockNotes.find(n => n.id === selectedNoteId);

  return (
    <div className="flex flex-col h-full">
      <div className="border-b bg-background sticky top-0 z-10">
        <div className="max-w-7xl mx-auto p-4 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">My Notes</h1>
            </div>
            <Button data-testid="button-new-note">
              <Plus className="h-4 w-4 mr-2" />
              New Note
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="record" data-testid="tab-record">
                <Mic className="h-4 w-4 mr-2" />
                Record
              </TabsTrigger>
              <TabsTrigger value="edit" data-testid="tab-edit">
                <FileText className="h-4 w-4 mr-2" />
                Edit
              </TabsTrigger>
              <TabsTrigger value="library" data-testid="tab-library">
                Browse Library
              </TabsTrigger>
            </TabsList>

            <TabsContent value="record" className="space-y-4">
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Start Recording</h2>
                  <p className="text-sm text-muted-foreground">
                    Record audio and get instant transcription in real-time
                  </p>
                </CardHeader>
                <CardContent>
                  <RecordingInterface
                    onStartRecording={() => console.log('Started recording')}
                    onStopRecording={() => console.log('Stopped recording')}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="edit" className="space-y-4">
              <Card className="h-[700px]">
                <NoteEditor
                  initialTitle={selectedNote?.title || "New Note"}
                  initialContent={selectedNote?.preview || ""}
                  format={selectedNote?.format || "notes"}
                  onSave={(title, content, format) => {
                    console.log('Saved note:', { title, content, format });
                  }}
                />
              </Card>
            </TabsContent>

            <TabsContent value="library" className="space-y-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  data-testid="input-search-notes"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredNotes.map((note) => (
                  <Card
                    key={note.id}
                    className="hover-elevate cursor-pointer"
                    onClick={() => {
                      setSelectedNoteId(note.id);
                      setActiveTab("edit");
                    }}
                    data-testid={`card-note-${note.id}`}
                  >
                    <CardHeader className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold line-clamp-2">{note.title}</h3>
                        <Badge variant="outline" className="shrink-0 text-xs">
                          {note.format}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {note.preview}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{note.date}</span>
                        <span>{note.duration}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
