import { SessionCard } from '../session-card';
import avatar1 from '@assets/generated_images/Asian_businesswoman_avatar_da0109c6.png';

export default function SessionCardExample() {
  return (
    <div className="p-6 max-w-md">
      <SessionCard
        id="1"
        title="Product Strategy Meeting Q4 2024"
        description="Quarterly planning session to discuss product roadmap and key initiatives for the upcoming quarter"
        hostName="Sarah Chen"
        hostAvatar={avatar1}
        category="Business"
        participantCount={24}
        languages={["EN", "ZH", "ES"]}
        status="live"
        startTime="2:30 PM Today"
        onJoin={() => console.log('Join session clicked')}
      />
    </div>
  );
}
