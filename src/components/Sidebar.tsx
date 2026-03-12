"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Globe, 
  Users, 
  LayoutDashboard, 
  Building2, 
  MapPin, 
  FileText, 
  CalendarDays,
  Medal,
  LogOut,
  Settings,
  MessageSquare,
  Mail,
  Shield
} from "lucide-react";

const navigation = [
  { name: "Admin Console", href: "/admin", icon: Shield },
  { name: "Global Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Global Communication", href: "/communication", icon: MessageSquare },
  { name: "Global Mailbox", href: "/mailbox", icon: Mail },
  { name: "Country Network", href: "/countries", icon: Globe },
  { name: "Organiser Management", href: "/organisers", icon: Users },
  { name: "Organiser Mailbox", href: "/organisers/mailbox", icon: Mail },
  { name: "Sponsors & Partners", href: "/sponsors", icon: Building2 },
  { name: "Sponsor Mailbox", href: "/sponsors/mailbox", icon: Mail },
  { name: "Tender Management", href: "/tenders", icon: FileText },
  { name: "Event Management", href: "/events", icon: CalendarDays },
  { name: "Volunteer Network", href: "/volunteers", icon: MapPin },
  { name: "Volunteer Mailbox", href: "/volunteers/mailbox", icon: Mail },
  { name: "Recognition", href: "/recognition", icon: Medal },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white dark:bg-[#111] dark:border-zinc-800">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-gray-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight dark:text-white">GAIO Command</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto pt-4">
        <div className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-2">
          Global Operations
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                    : "text-gray-700 hover:bg-gray-100 dark:text-zinc-300 dark:hover:bg-zinc-800/50"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 shrink-0 ${
                    isActive ? "text-blue-700 dark:text-blue-400" : "text-gray-400 group-hover:text-gray-500 dark:text-zinc-500"
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t border-gray-200 p-4 dark:border-zinc-800">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-zinc-400">
            SA
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900 dark:text-white">Super Admin</span>
            <span className="text-xs text-gray-500 dark:text-zinc-500">Global Leadership</span>
          </div>
        </div>
        <button className="mt-2 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
