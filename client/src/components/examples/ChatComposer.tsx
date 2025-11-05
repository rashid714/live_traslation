import { ChatComposer } from '../chat-composer';

export default function ChatComposerExample() {
  return (
    <div className="w-full max-w-2xl border rounded-lg bg-background">
      <ChatComposer
        onSendMessage={(message, language, isVoice) => {
          console.log('Sent:', { message, language, isVoice });
        }}
      />
    </div>
  );
}
