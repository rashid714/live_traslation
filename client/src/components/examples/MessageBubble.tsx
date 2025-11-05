import { MessageBubble } from '../message-bubble';
import avatar1 from '@assets/generated_images/Asian_businesswoman_avatar_da0109c6.png';

export default function MessageBubbleExample() {
  return (
    <div className="p-6 space-y-4 bg-background">
      <MessageBubble
        id="1"
        text="Hey, did you get my notes from the meeting?"
        senderName="Sarah Chen"
        senderAvatar={avatar1}
        timestamp="2:30 PM"
        isOwn={false}
      />
      <MessageBubble
        id="2"
        text="Yes, thank you! They were very helpful."
        senderName="You"
        timestamp="2:31 PM"
        isOwn={true}
      />
      <MessageBubble
        id="3"
        text="这个项目看起来很有前景"
        senderName="Sarah Chen"
        senderAvatar={avatar1}
        timestamp="2:32 PM"
        isOwn={false}
        originalLanguage="ZH"
        translatedText="This project looks very promising"
      />
    </div>
  );
}
