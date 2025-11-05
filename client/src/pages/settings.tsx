import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Settings() {
  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="max-w-4xl mx-auto w-full p-6 space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>

        <Card>
          <CardHeader>
            <CardTitle>Language & Translation</CardTitle>
            <CardDescription>
              Configure your language preferences and translation settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-translate">Auto-translate messages</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically translate incoming messages to your language
                </p>
              </div>
              <Switch id="auto-translate" defaultChecked data-testid="switch-auto-translate" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-original">Show original text</Label>
                <p className="text-sm text-muted-foreground">
                  Display original text alongside translations
                </p>
              </div>
              <Switch id="show-original" defaultChecked data-testid="switch-show-original" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default-language">Default Language</Label>
              <Select defaultValue="en">
                <SelectTrigger id="default-language" data-testid="select-default-language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="ur">اردو</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Manage how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="session-notifications">Session notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when sessions you're interested in go live
                </p>
              </div>
              <Switch id="session-notifications" defaultChecked data-testid="switch-session-notifications" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="message-notifications">Message notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications for new messages
                </p>
              </div>
              <Switch id="message-notifications" defaultChecked data-testid="switch-message-notifications" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="qa-notifications">Q&A notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when your questions are answered
                </p>
              </div>
              <Switch id="qa-notifications" defaultChecked data-testid="switch-qa-notifications" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recording & Transcription</CardTitle>
            <CardDescription>
              Configure recording and transcription preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-save">Auto-save transcripts</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically save transcripts after sessions
                </p>
              </div>
              <Switch id="auto-save" defaultChecked data-testid="switch-auto-save" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="speaker-detection">Speaker detection</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically identify different speakers
                </p>
              </div>
              <Switch id="speaker-detection" defaultChecked data-testid="switch-speaker-detection" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quality">Transcription Quality</Label>
              <Select defaultValue="high">
                <SelectTrigger id="quality" data-testid="select-quality">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button variant="outline" data-testid="button-reset">Reset to Defaults</Button>
          <Button data-testid="button-save-settings">Save Settings</Button>
        </div>
      </div>
    </div>
  );
}
