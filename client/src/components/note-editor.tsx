import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Download, Share2, Save } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NoteEditorProps {
  initialTitle?: string;
  initialContent?: string;
  format?: string;
  onSave?: (title: string, content: string, format: string) => void;
}

export function NoteEditor({
  initialTitle = "",
  initialContent = "",
  format = "notes",
  onSave,
}: NoteEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [selectedFormat, setSelectedFormat] = useState(format);

  const handleSave = () => {
    onSave?.(title, content, selectedFormat);
    console.log('Note saved:', { title, content, format: selectedFormat });
  };

  return (
    <div className="flex flex-col h-full gap-4 p-4">
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 text-lg font-semibold"
          data-testid="input-note-title"
        />
        <Select value={selectedFormat} onValueChange={setSelectedFormat}>
          <SelectTrigger className="w-48" data-testid="select-note-format">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="notes">Notes</SelectItem>
            <SelectItem value="meeting-minutes">Meeting Minutes</SelectItem>
            <SelectItem value="lecture">Lecture Notes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Textarea
        placeholder="Start typing your notes..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 resize-none text-base"
        data-testid="input-note-content"
      />

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline">Auto-saved</Badge>
          <span className="text-xs text-muted-foreground">Last saved 2 minutes ago</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSave} data-testid="button-save-note">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm" data-testid="button-export-note">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" data-testid="button-share-note">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}
