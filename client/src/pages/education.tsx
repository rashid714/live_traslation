import { useState } from "react";
import { ClassroomCard } from "@/components/classroom-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, BookOpen } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

//todo: remove mock functionality
const mockClassrooms = [
  {
    id: '1',
    title: 'Advanced Business Strategy',
    instructor: 'Dr. Sarah Chen',
    studentCount: 45,
    sessionCount: 12,
    subject: 'Business',
    nextSession: 'Today, 3:00 PM',
  },
  {
    id: '2',
    title: 'Machine Learning Fundamentals',
    instructor: 'Prof. Ahmed Hassan',
    studentCount: 156,
    sessionCount: 20,
    subject: 'Technology',
    nextSession: 'Tomorrow, 2:00 PM',
  },
  {
    id: '3',
    title: 'International Marketing',
    instructor: 'Maria Rodriguez',
    studentCount: 67,
    sessionCount: 10,
    subject: 'Marketing',
    nextSession: 'Friday, 10:00 AM',
  },
  {
    id: '4',
    title: 'Corporate Finance',
    instructor: 'James Wilson',
    studentCount: 89,
    sessionCount: 15,
    subject: 'Finance',
  },
  {
    id: '5',
    title: 'Leadership & Management',
    instructor: 'Dr. Linda Park',
    studentCount: 112,
    sessionCount: 8,
    subject: 'Business',
    nextSession: 'Monday, 4:00 PM',
  },
  {
    id: '6',
    title: 'Data Science with Python',
    instructor: 'Prof. Raj Kumar',
    studentCount: 203,
    sessionCount: 18,
    subject: 'Technology',
    nextSession: 'Tuesday, 1:00 PM',
  },
];

export default function Education() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");

  const filteredClassrooms = mockClassrooms.filter((classroom) => {
    const matchesSearch = classroom.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classroom.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === "all" || classroom.subject.toLowerCase() === selectedSubject.toLowerCase();
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="flex flex-col h-full">
      <div className="border-b bg-background sticky top-0 z-10">
        <div className="max-w-7xl mx-auto p-4 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Education Hub</h1>
            </div>
            <Button data-testid="button-create-classroom">
              <Plus className="h-4 w-4 mr-2" />
              Create Classroom
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search classrooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search-classrooms"
              />
            </div>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full sm:w-48" data-testid="select-subject">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-4">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">My Classrooms</h2>
            <p className="text-sm text-muted-foreground">
              Access your enrolled courses and view upcoming sessions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClassrooms.map((classroom) => (
              <ClassroomCard
                key={classroom.id}
                {...classroom}
                onEnter={() => console.log('Entering classroom:', classroom.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
