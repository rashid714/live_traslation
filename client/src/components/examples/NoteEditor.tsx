import { NoteEditor } from '../note-editor';

export default function NoteEditorExample() {
  return (
    <div className="h-[600px] w-full border rounded-lg bg-background">
      <NoteEditor
        initialTitle="Product Strategy Meeting Notes"
        initialContent="Key discussion points:\n\n1. Q4 roadmap priorities\n2. Customer feedback analysis\n3. Competitive landscape"
        format="meeting-minutes"
        onSave={(title, content, format) => {
          console.log('Saved:', { title, content, format });
        }}
      />
    </div>
  );
}
