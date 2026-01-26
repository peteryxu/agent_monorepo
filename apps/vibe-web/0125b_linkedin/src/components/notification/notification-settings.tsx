"use client";

import { useState } from "react";
import { X, Mail, Bell, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface NotificationSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SettingToggle {
  id: string;
  label: string;
  description: string;
  defaultValue: boolean;
}

const emailSettings: SettingToggle[] = [
  {
    id: "email-connections",
    label: "Connection requests",
    description: "When someone sends you a connection request",
    defaultValue: true,
  },
  {
    id: "email-messages",
    label: "Messages",
    description: "When you receive a new message",
    defaultValue: true,
  },
  {
    id: "email-mentions",
    label: "Mentions",
    description: "When someone mentions you in a post or comment",
    defaultValue: true,
  },
  {
    id: "email-reactions",
    label: "Reactions and comments",
    description: "When someone reacts to or comments on your posts",
    defaultValue: false,
  },
  {
    id: "email-jobs",
    label: "Job recommendations",
    description: "New jobs that match your profile",
    defaultValue: true,
  },
  {
    id: "email-profile-views",
    label: "Profile views",
    description: "Weekly summary of who viewed your profile",
    defaultValue: false,
  },
];

const pushSettings: SettingToggle[] = [
  {
    id: "push-connections",
    label: "Connection requests",
    description: "Instant notifications for new connection requests",
    defaultValue: true,
  },
  {
    id: "push-messages",
    label: "Messages",
    description: "Instant notifications for new messages",
    defaultValue: true,
  },
  {
    id: "push-mentions",
    label: "Mentions",
    description: "When someone mentions you",
    defaultValue: true,
  },
  {
    id: "push-reactions",
    label: "Reactions",
    description: "When someone reacts to your content",
    defaultValue: true,
  },
  {
    id: "push-comments",
    label: "Comments",
    description: "When someone comments on your posts",
    defaultValue: true,
  },
  {
    id: "push-jobs",
    label: "Job alerts",
    description: "New jobs matching your preferences",
    defaultValue: false,
  },
];

type FrequencyOption = "instant" | "daily" | "weekly";

export function NotificationSettings({ open, onOpenChange }: NotificationSettingsProps) {
  const [emailToggles, setEmailToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(emailSettings.map((s) => [s.id, s.defaultValue]))
  );
  const [pushToggles, setPushToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(pushSettings.map((s) => [s.id, s.defaultValue]))
  );
  const [emailFrequency, setEmailFrequency] = useState<FrequencyOption>("daily");

  const handleEmailToggle = (id: string) => {
    setEmailToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePushToggle = (id: string) => {
    setPushToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </DialogTitle>
          <DialogDescription>
            Manage how and when you receive notifications
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Email Notifications Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Mail className="h-4 w-4 text-[var(--muted-foreground)]" />
              <h3 className="text-sm font-semibold">Email Notifications</h3>
            </div>

            {/* Email Frequency */}
            <div className="mb-4 p-3 bg-[var(--muted)] rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-[var(--muted-foreground)]" />
                <span className="text-sm font-medium">Email Frequency</span>
              </div>
              <div className="flex gap-2">
                {(["instant", "daily", "weekly"] as const).map((freq) => (
                  <Button
                    key={freq}
                    size="sm"
                    variant={emailFrequency === freq ? "default" : "outline"}
                    onClick={() => setEmailFrequency(freq)}
                    className="capitalize"
                  >
                    {freq}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {emailSettings.map((setting) => (
                <div
                  key={setting.id}
                  className="flex items-start justify-between gap-4"
                >
                  <div className="flex-1">
                    <label
                      htmlFor={setting.id}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {setting.label}
                    </label>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {setting.description}
                    </p>
                  </div>
                  <Switch
                    id={setting.id}
                    checked={emailToggles[setting.id]}
                    onCheckedChange={() => handleEmailToggle(setting.id)}
                  />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Push Notifications Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-4 w-4 text-[var(--muted-foreground)]" />
              <h3 className="text-sm font-semibold">Push Notifications</h3>
            </div>

            <div className="space-y-4">
              {pushSettings.map((setting) => (
                <div
                  key={setting.id}
                  className="flex items-start justify-between gap-4"
                >
                  <div className="flex-1">
                    <label
                      htmlFor={setting.id}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {setting.label}
                    </label>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {setting.description}
                    </p>
                  </div>
                  <Switch
                    id={setting.id}
                    checked={pushToggles[setting.id]}
                    onCheckedChange={() => handlePushToggle(setting.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
