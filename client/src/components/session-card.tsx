import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Clock, Languages, Play } from "lucide-react";

interface SessionCardProps {
  id: string;
  title: string;
  description: string;
  hostName: string;
  hostAvatar?: string;
  category: string;
  participantCount: number;
  languages: string[];
  status: "live" | "scheduled" | "ended";
  startTime: string;
  onJoin?: () => void;
}

export function SessionCard({
  title,
  description,
  hostName,
  hostAvatar,
  category,
  participantCount,
  languages,
  status,
  startTime,
  onJoin,
}: SessionCardProps) {
  return (
    <Card className="hover-elevate">
      <CardHeader className="gap-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="h-10 w-10">
              <AvatarImage src={hostAvatar} />
              <AvatarFallback>{hostName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{hostName}</p>
              <p className="text-xs text-muted-foreground">{startTime}</p>
            </div>
          </div>
          {status === "live" && (
            <Badge variant="destructive" className="animate-pulse">
              LIVE
            </Badge>
          )}
          {status === "scheduled" && <Badge variant="secondary">Upcoming</Badge>}
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="gap-1">
            {category}
          </Badge>
          {languages.map((lang) => (
            <Badge key={lang} variant="secondary" className="gap-1">
              <Languages className="h-3 w-3" />
              {lang}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{participantCount} participants</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{startTime}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          variant={status === "live" ? "default" : "secondary"}
          onClick={onJoin}
          data-testid="button-join-session"
        >
          {status === "live" ? (
            <>
              <Play className="h-4 w-4 mr-2" />
              Join Live Session
            </>
          ) : (
            "View Details"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
