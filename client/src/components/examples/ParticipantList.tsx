import { ParticipantList } from '../participant-list';
import avatar1 from '@assets/generated_images/Asian_businesswoman_avatar_da0109c6.png';
import avatar2 from '@assets/generated_images/Middle_Eastern_businessman_avatar_22108a53.png';
import avatar3 from '@assets/generated_images/Hispanic_woman_avatar_6ade3757.png';
import avatar4 from '@assets/generated_images/African_businessman_avatar_d7049125.png';

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

export default function ParticipantListExample() {
  return (
    <div className="h-96 w-80 border rounded-lg bg-background">
      <ParticipantList participants={mockParticipants} />
    </div>
  );
}
