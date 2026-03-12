"use client";

import { useState } from "react";
import { 
  Send, 
  Hash, 
  Plus, 
  Search, 
  Users, 
  Bell, 
  Megaphone, 
  Globe, 
  MessageSquare,
  Shield,
  Filter
} from "lucide-react";

const initialChannels = [
  { id: "ch-1", name: "Global Announcements", type: "ANNOUNCEMENT", description: "Official updates from GAIO Leadership", target: "ALL" },
  { id: "ch-2", name: "Regional Coordination - Europe", type: "REGIONAL", description: "Coordination for European national organisers", target: "ORGANISER" },
  { id: "ch-3", name: "Volunteer Network", type: "GENERAL", description: "General discussion for all global volunteers", target: "VOLUNTEER" },
  { id: "ch-4", name: "Technical Support", type: "SUPPORT", description: "Platform and competition technical help", target: "ALL" },
  { id: "ch-5", name: "Sponsor & Partners", type: "PARTNER", description: "Communication with global sponsors", target: "SPONSOR" },
];

const mockMessages = [
  { id: "m1", channelId: "ch-1", sender: "Super Admin", role: "SUPER_ADMIN", content: "Welcome to the new GAIO Command Communication system. All major announcements will be posted here.", time: "10:30 AM", target: "ALL" },
  { id: "m2", channelId: "ch-1", sender: "Global Director", role: "GLOBAL_ADMIN", content: "The tender for the 2027 Global Finals is now officially open for applications.", time: "11:45 AM", target: "ORGANISER" },
  { id: "m3", channelId: "ch-2", sender: "Regional Lead", role: "REGIONAL_COORDINATOR", content: "Please ensure all European country directors have submitted their Q1 reports.", time: "09:15 AM", target: "ORGANISER" },
];

const directory = [
  { name: "James Wilson", role: "Country Director", country: "United Kingdom", online: true },
  { name: "Yuki Tanaka", role: "Regional Coordinator", country: "Japan", online: true },
  { name: "Carlos Silva", role: "Event Organiser", country: "Brazil", online: false },
  { name: "Zanele Mbeki", role: "Global Admin", country: "South Africa", online: true },
];

export default function CommunicationPage() {
  const [activeChannel, setActiveChannel] = useState(initialChannels[0]);
  const [channels, setChannels] = useState(initialChannels);
  const [allMessages, setAllMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [targetType, setTargetType] = useState("ALL");
  const [isCreatingChannel, setIsCreatingChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");

  // Filter messages for the active channel
  const filteredMessages = allMessages.filter(m => m.channelId === activeChannel.id);

  const handleCreateChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName) return;
    
    const newChannel = {
      id: `ch-${channels.length + 1}`,
      name: newChannelName,
      type: "GENERAL",
      description: "Custom communication channel",
      target: "ALL"
    };
    
    setChannels([...channels, newChannel]);
    setNewChannelName("");
    setIsCreatingChannel(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      id: `m-${Date.now()}`,
      channelId: activeChannel.id,
      sender: "Super Admin",
      role: "SUPER_ADMIN",
      content: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      target: targetType
    };

    setAllMessages([...allMessages, msg]);
    setNewMessage("");
  };

  return (
    <div className="flex h-[calc(100vh-160px)] gap-6 overflow-hidden">
      {/* Channels Sidebar */}
      <div className="flex w-72 flex-col rounded-xl border border-gray-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-[#111]">
        <div className="flex items-center justify-between border-b border-gray-100 p-4 dark:border-zinc-800">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">Channels</h2>
          <button 
            onClick={() => setIsCreatingChannel(true)}
            className="rounded-md p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 text-blue-600 dark:text-blue-400"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {channels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => setActiveChannel(channel)}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                activeChannel.id === channel.id
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                  : "text-gray-600 hover:bg-gray-50 dark:text-zinc-400 dark:hover:bg-zinc-800/50"
              }`}
            >
              <div className="flex items-center gap-2 flex-1">
                {channel.type === 'ANNOUNCEMENT' ? <Megaphone className="h-4 w-4" /> : <Hash className="h-4 w-4" />}
                {channel.name}
              </div>
              <span className="text-[10px] bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-gray-500">
                {channel.target}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex flex-1 flex-col rounded-xl border border-gray-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-[#111]">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-gray-100 p-4 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20">
              {activeChannel.type === 'ANNOUNCEMENT' ? 
                <Megaphone className="h-5 w-5 text-blue-600 dark:text-blue-400" /> : 
                <Hash className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              }
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">{activeChannel.name}</h3>
                <span className="text-[10px] bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold">
                  Target: {activeChannel.target}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-zinc-500">{activeChannel.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Users className="h-4 w-4" />
            145 Members
          </div>
        </div>

        {/* Message History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {filteredMessages.map((msg) => (
            <div key={msg.id} className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800 text-sm font-bold text-gray-600 dark:text-zinc-400">
                {msg.sender.charAt(0)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{msg.sender}</span>
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    msg.role === 'SUPER_ADMIN' ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' : 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                  }`}>
                    {msg.role.replace('_', ' ')}
                  </span>
                  {msg.target !== 'ALL' && (
                    <span className="text-[10px] bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 px-1.5 py-0.5 rounded font-bold">
                      ONLY FOR: {msg.target}
                    </span>
                  )}
                  <span className="text-[10px] text-gray-400">{msg.time}</span>
                </div>
                <div className="text-sm text-gray-700 dark:text-zinc-300 leading-relaxed">
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {filteredMessages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-gray-500 dark:text-zinc-500 opacity-50">
              <MessageSquare className="h-12 w-12 mb-2" />
              <p className="text-sm italic">No messages in this channel yet.</p>
            </div>
          )}
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="border-t border-gray-100 p-4 dark:border-zinc-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <Filter className="h-3 w-3" />
              Channel/Target:
            </div>
            <div className="flex gap-2">
              {['ALL', 'ORGANISER', 'SPONSOR', 'VOLUNTEER'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTargetType(t)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold transition-colors ${
                    targetType === t 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="relative flex items-center">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Message to ${targetType} in #${activeChannel.name}...`}
              className="block w-full rounded-lg border-0 py-3 pl-4 pr-12 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800 dark:focus:ring-blue-500"
            />
            <button 
              type="submit"
              className="absolute right-2 p-2 text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Directory Sidebar */}
      <div className="flex w-72 flex-col rounded-xl border border-gray-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-[#111]">
        <div className="border-b border-gray-100 p-4 dark:border-zinc-800">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">Directory</h2>
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full rounded-md border-0 bg-gray-50 py-1.5 pl-9 text-xs ring-1 ring-inset ring-gray-200 dark:bg-zinc-800/50 dark:text-white dark:ring-zinc-800"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {directory.map((user) => (
            <div key={user.name} className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800 text-xs font-bold text-gray-600 dark:text-zinc-400">
                  {user.name.charAt(0)}
                </div>
                {user.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500 dark:border-[#111]" />
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <h4 className="truncate text-xs font-bold text-gray-900 dark:text-white">{user.name}</h4>
                <p className="truncate text-[10px] text-gray-500 dark:text-zinc-500">{user.role} • {user.country}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Channel Modal Overlay */}
      {isCreatingChannel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl dark:bg-[#111] dark:border dark:border-zinc-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Create New Channel</h2>
            <form onSubmit={handleCreateChannel}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Channel Name</label>
                  <div className="relative flex items-center">
                    <Hash className="absolute left-3 h-4 w-4 text-gray-400" />
                    <input
                      autoFocus
                      type="text"
                      value={newChannelName}
                      onChange={(e) => setNewChannelName(e.target.value)}
                      placeholder="e.g. tech-support"
                      className="block w-full rounded-lg border-0 py-2.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreatingChannel(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
                >
                  Create Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
