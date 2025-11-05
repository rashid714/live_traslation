import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, Calendar } from "lucide-react";

interface ClassroomCardProps {
  id: string;
  title: string;
  instructor: string;
  studentCount: number;
  sessionCount: number;
  subject: string;
  nextSession?: string;
  onEnter?: () => void;
}

export function ClassroomCard({
  title,
  instructor,
  studentCount,
  sessionCount,
  subject,
  nextSession,
  onEnter,
}: ClassroomCardProps) {
  return (
    <Card className="hover-elevate">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary">{subject}</Badge>
          {nextSession && <Badge variant="outline">Next: {nextSession}</Badge>}
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">Instructor: {instructor}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{studentCount} students</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>{sessionCount} sessions</span>
          </div>
        </div>
        {nextSession && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Next session: {nextSession}</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={onEnter} data-testid="button-enter-classroom">
          Enter Classroom
        </Button>
      </CardFooter>
    </Card>
  );
}
