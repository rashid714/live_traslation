import { RecordingInterface } from '../recording-interface';

export default function RecordingInterfaceExample() {
  return (
    <div className="w-full max-w-2xl border rounded-lg bg-background">
      <RecordingInterface
        onStartRecording={() => console.log('Recording started')}
        onStopRecording={() => console.log('Recording stopped')}
      />
    </div>
  );
}
