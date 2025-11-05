import { useState } from "react";
import { SessionCard } from "@/components/session-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, TrendingUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import avatar1 from '@assets/generated_images/Asian_businesswoman_avatar_da0109c6.png';
import avatar2 from '@assets/generated_images/Middle_Eastern_businessman_avatar_22108a53.png';
import avatar3 from '@assets/generated_images/Hispanic_woman_avatar_6ade3757.png';
import avatar4 from '@assets/generated_images/African_businessman_avatar_d7049125.png';

//todo: remove mock functionality
const mockSessions = [
  {
    id: '1',
    title: 'Q4 Product Strategy Meeting',
    description: 'Quarterly planning session to discuss product roadmap and key initiatives for the upcoming quarter',
    hostName: 'Sarah Chen',
    hostAvatar: avatar1,
    category: 'Business',
    participantCount: 24,
    languages: ['EN', 'ZH', 'ES'],
    status: 'live' as const,
    startTime: '2:30 PM Today',
  },
  {
    id: '2',
    title: 'Advanced Machine Learning Lecture',
    description: 'Deep dive into neural networks and modern ML architectures for production systems',
    hostName: 'Ahmed Hassan',
    hostAvatar: avatar2,
    category: 'Technology',
    participantCount: 156,
    languages: ['EN', 'AR'],
    status: 'live' as const,
    startTime: '3:00 PM Today',
  },
  {
    id: '3',
    title: 'Global Marketing Strategy Workshop',
    description: 'Interactive workshop on developing effective marketing strategies for international markets',
    hostName: 'Maria Rodriguez',
    hostAvatar: avatar3,
    category: 'Marketing',
    participantCount: 45,
    languages: ['EN', 'ES', 'PT'],
    status: 'scheduled' as const,
    startTime: '5:00 PM Today',
  },
  {
    id: '4',
    title: 'Financial Planning Fundamentals',
    description: 'Essential concepts and strategies for personal and corporate financial planning',
    hostName: 'James Wilson',
    hostAvatar: avatar4,
    category: 'Finance',
    participantCount: 89,
    languages: ['EN'],
    status: 'scheduled' as const,
    startTime: 'Tomorrow, 10:00 AM',
  },
];

export default function Feed() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredSessions = mockSessions.filter((session) => {
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || session.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col h-full">
      <div className="border-b bg-background sticky top-0 z-10">
        <div className="max-w-7xl mx-auto p-4 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold">Discover Sessions</h1>
            <Button data-testid="button-create-session">
              <Plus className="h-4 w-4 mr-2" />
              Create Session
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search-sessions"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48" data-testid="select-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="education">Education</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-muted-foreground shrink-0">Trending:</span>
            <Badge variant="secondary" className="shrink-0">Product Strategy</Badge>
            <Badge variant="secondary" className="shrink-0">Machine Learning</Badge>
            <Badge variant="secondary" className="shrink-0">Leadership</Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <SessionCard
                key={session.id}
                {...session}
                onJoin={() => console.log('Joining session:', session.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
