"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Bell,
  CheckCheck,
  Hash,
  MessageSquare,
  Paperclip,
  Send,
  Users,
  Video,
} from "lucide-react";
import { toast } from "sonner";

interface MessageItem {
  id: string;
  sender: string;
  role: string;
  text: string;
  timestamp: string;
  isSelf?: boolean;
}

const channels = [
  { id: "ch-announcements", name: "production-announcements", unread: 0, isLocked: true },
  { id: "ch-mainunit", name: "main-unit-shooting", unread: 2 },
  { id: "ch-camera", name: "camera-and-dp", unread: 0 },
  { id: "ch-direction", name: "directors-ad-room", unread: 1 },
  { id: "ch-cast", name: "cast-and-talent-alerts", unread: 0 },
];

export default function CommunicationsView() {
  const [activeChannel, setActiveChannel] = useState(channels[1]);
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: "m-1",
      sender: "Christopher Nolan",
      role: "Director",
      text: "Great work on Sc. 42A rehearsal today. Reminder for tomorrow: we roll IMAX A & B cameras promptly at 07:30 AM at Ridge Point West.",
      timestamp: "18:45 Today",
    },
    {
      id: "m-2",
      sender: "Nilo Otero",
      role: "First AD",
      text: "Call sheet v2 has been dispatched. Basecamp shuttles depart Lot B every 10 minutes starting at 05:00 AM.",
      timestamp: "19:02 Today",
    },
    {
      id: "m-3",
      sender: "Marcus Sterling",
      role: "Commander Thorne (Lead)",
      text: "Understood. Arriving in Basecamp Lot B at 05:15 AM for prosthetics.",
      timestamp: "19:15 Today",
    },
  ]);
  const [inputText, setInputText] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const newMsg: MessageItem = {
      id: `m-${Date.now()}`,
      sender: "Marcus Vance",
      role: "Executive Producer",
      text: inputText,
      timestamp: "Just now",
      isSelf: true,
    };
    setMessages([...messages, newMsg]);
    setInputText("");
    toast.success("Message dispatched to channel subscribers.");
  };

  const handleLaunchMeeting = (platform: "Google Meet" | "Zoom") => {
    toast.info(`Generating secure authorized meeting room link via ${platform} Integration...`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Production Communications Hub"
        description="Department channels, real-time shooting updates, production announcements, and video conference integrations."
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleLaunchMeeting("Google Meet")}
              className="text-xs flex items-center gap-1.5"
            >
              <Video className="h-3.5 w-3.5 text-primary" />
              Start Google Meet
            </Button>
            <Button
              size="sm"
              onClick={() => handleLaunchMeeting("Zoom")}
              className="bg-[#167D8D] text-white hover:bg-[#126572] text-xs flex items-center gap-1.5"
            >
              <Video className="h-3.5 w-3.5" />
              Launch Zoom Room
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[620px]">
        {/* Left: Channels List */}
        <div className="lg:col-span-4 h-full">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-sm font-bold text-foreground">Production Channels</CardTitle>
              <CardDescription className="text-xs">Chrono Raiders Production Unit</CardDescription>
            </CardHeader>
            <CardContent className="p-2 space-y-1 overflow-y-auto flex-1">
              {channels.map((ch) => {
                const isSelected = activeChannel.id === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChannel(ch)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-[#167D8D] text-white"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Hash className="h-3.5 w-3.5 shrink-0 opacity-70" />
                      <span className="truncate">{ch.name}</span>
                    </div>
                    {ch.unread > 0 && (
                      <span className="bg-white/20 text-white rounded-full px-1.5 py-0.2 text-[10px] font-bold">
                        {ch.unread}
                      </span>
                    )}
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Right: Message Stream */}
        <div className="lg:col-span-8 h-full">
          <Card className="h-full flex flex-col justify-between overflow-hidden">
            <CardHeader className="py-3 px-4 border-b border-border flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-primary" />
                <div>
                  <h4 className="text-xs font-bold text-foreground">{activeChannel.name}</h4>
                  <p className="text-[10px] text-muted-foreground">38 Cast & Crew Online</p>
                </div>
              </div>
              <Badge variant="default" className="text-2xs">
                Active Shoot Feed
              </Badge>
            </CardHeader>

            <CardContent className="p-4 space-y-3.5 overflow-y-auto flex-1">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col text-xs ${
                    m.isSelf ? "items-end" : "items-start"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-foreground text-2xs">{m.sender}</span>
                    <span className="text-[10px] text-[#167D8D] font-medium">({m.role})</span>
                    <span className="text-[10px] text-muted-foreground">{m.timestamp}</span>
                  </div>
                  <div
                    className={`p-3 rounded-xl max-w-lg leading-relaxed ${
                      m.isSelf
                        ? "bg-[#167D8D] text-white"
                        : "bg-muted text-foreground border border-border"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </CardContent>

            <div className="p-3 border-t border-border bg-card">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toast.info("Attach script page, photograph, or audio note...")}
                  className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
                >
                  <Paperclip className="h-4 w-4" />
                </button>
                <input
                  type="text"
                  placeholder={`Message #${activeChannel.name}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 h-9 px-3 rounded-lg border border-border bg-background text-xs outline-none focus:ring-1 focus:ring-primary"
                />
                <Button type="submit" size="sm" className="bg-[#167D8D] text-white hover:bg-[#126572] h-9">
                  <Send className="h-3.5 w-3.5 mr-1" />
                  Send
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

