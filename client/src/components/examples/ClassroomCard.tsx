import { ClassroomCard } from '../classroom-card';

export default function ClassroomCardExample() {
  return (
    <div className="p-6 max-w-md">
      <ClassroomCard
        id="1"
        title="Advanced Business Strategy"
        instructor="Dr. Sarah Chen"
        studentCount={45}
        sessionCount={12}
        subject="Business"
        nextSession="Today, 3:00 PM"
        onEnter={() => console.log('Enter classroom clicked')}
      />
    </div>
  );
}
