import { TranscriptPanel } from '../transcript-panel';
import avatar1 from '@assets/generated_images/Asian_businesswoman_avatar_da0109c6.png';
import avatar2 from '@assets/generated_images/Middle_Eastern_businessman_avatar_22108a53.png';

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

export default function TranscriptPanelExample() {
  return (
    <div className="h-[600px] w-full max-w-2xl border rounded-lg bg-background">
      <TranscriptPanel transcripts={mockTranscripts} selectedLanguage="EN" />
    </div>
  );
}
