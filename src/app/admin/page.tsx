"use client";

import { useState } from "react";
import { 
  Shield, 
  Users, 
  Globe, 
  Mail, 
  Activity, 
  Database, 
  Settings, 
  Search, 
  Lock, 
  CheckCircle2, 
  AlertTriangle,
  ArrowUpRight,
  Filter,
  MoreVertical,
  Key,
  X,
  Star
} from "lucide-react";

// Mock data for Admin Section
const initialSystemUsers = [
  { id: "U-1", name: "Super Admin", email: "admin@gaio.uk", role: "SUPER_ADMIN", status: "Active", lastLogin: "2 mins ago" },
  { id: "U-2", name: "James Wilson", email: "james@teched.uk", role: "COUNTRY_DIRECTOR", status: "Active", lastLogin: "1 hour ago" },
  { id: "U-3", name: "Sarah Jenkins", email: "s.jenkins@mit.edu", role: "VOLUNTEER_LEAD", status: "Inactive", lastLogin: "3 days ago" },
  { id: "U-4", name: "Yuki Tanaka", email: "tanaka@jaif.jp", role: "REGIONAL_COORDINATOR", status: "Active", lastLogin: "5 hours ago" },
];

const auditLogs = [
  { id: 1, user: "Super Admin", action: "Deleted Organiser ORG-009", time: "10:45 AM", severity: "HIGH" },
  { id: 2, user: "James Wilson", action: "Updated Event EVT-002", time: "09:30 AM", severity: "LOW" },
  { id: 3, user: "System", action: "Backup completed successfully", time: "03:00 AM", severity: "INFO" },
  { id: 4, user: "Super Admin", action: "Changed Volunteer Status V-001", time: "Yesterday", severity: "MEDIUM" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("OVERVIEW");
  
  // Real Data Aggregation Logic
  const [financialStats, setFinancialStats] = useState(() => {
    if (typeof window !== 'undefined') {
      const sponsors = JSON.parse(localStorage.getItem('gaio_sponsors') || '[]');
      const events = JSON.parse(localStorage.getItem('gaio_events') || '[]');
      
      const totalSponsorship = sponsors.reduce((acc: number, s: any) => {
        const val = parseInt(s.funding.replace(/[^0-9]/g, '')) || 0;
        return acc + val;
      }, 0);

      const opSpend = events.length * 250000; // Simulating $250k per event
      const globalBudget = totalSponsorship * 1.5; // Simulating 50% matched funding

      return {
        totalSponsorship,
        opSpend,
        globalBudget,
        sponsorCount: sponsors.length
      };
    }
    return { totalSponsorship: 8920000, opSpend: 3120450, globalBudget: 12450000, sponsorCount: 18 };
  });

  // USER MANAGEMENT STATE
  const [systemUsers, setSystemUsers] = useState(initialSystemUsers);
  const [userSearch, setUserSearch] = useState("");
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "COUNTRY_DIRECTOR" });

  // ANNOUNCEMENTS STATE
  const [announcement, setAnnouncement] = useState({ title: "", content: "", audience: "All Users (Global)", priority: "Normal (Informational)", emailSync: false });

  // SYSTEM CONFIG STATE
  const [sysConfig, setSysConfig] = useState({ maintenance: false, registration: true, publicTenders: false });

  // GLOBAL MAIL STATE
  const [activeMailDept, setActiveMailDept] = useState("global");
  const [isMailModalOpen, setIsMailModalOpen] = useState(false);
  const [mailAccounts, setMailAccounts] = useState(() => {
    const depts = [
      { id: 'global', name: 'Global Main', email: 'admin@gaio.uk' },
      { id: 'organisers', name: 'Organisers', email: 'organisers@gaio.uk' },
      { id: 'sponsors', name: 'Sponsors', email: 'partners@gaio.uk' },
      { id: 'volunteers', name: 'Volunteers', email: 'volunteers@gaio.uk' },
    ];
    
    if (typeof window !== 'undefined') {
      return depts.map(d => {
        const key = d.id === 'global' ? 'gaioMailConfig' : `gaioMailConfig_${d.id}`;
        const saved = localStorage.getItem(key);
        if (saved) {
          const config = JSON.parse(saved);
          return { ...d, email: config.user, status: 'Connected' };
        }
        return { ...d, status: 'Not Configured' };
      });
    }
    return depts.map(d => ({ ...d, status: 'Not Configured' }));
  });
  const [tempMailConfig, setTempMailConfig] = useState({
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    imapHost: "imap.gmail.com",
    imapPort: "993",
    user: "",
    pass: ""
  });

  const getDeptKey = (dept: string) => {
    if (dept === 'global') return 'gaioMailConfig';
    return `gaioMailConfig_${dept}`;
  };

  const handleOpenMailConfig = (dept: string) => {
    setActiveMailDept(dept);
    const saved = localStorage.getItem(getDeptKey(dept));
    if (saved) {
      setTempMailConfig(JSON.parse(saved));
    } else {
      setTempMailConfig({
        smtpHost: "smtp.gmail.com",
        smtpPort: "587",
        imapHost: "imap.gmail.com",
        imapPort: "993",
        user: "",
        pass: ""
      });
    }
    setIsMailModalOpen(true);
  };

  const handleSaveMailConfig = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(getDeptKey(activeMailDept), JSON.stringify(tempMailConfig));
    setIsMailModalOpen(false);
    alert(`Configuration for ${activeMailDept.toUpperCase()} Mailbox has been pushed successfully! It is now automatically configured.`);
  };

  const stats = [
    { label: "Total System Users", value: systemUsers.length.toString(), icon: Users, color: "text-blue-600" },
    { label: "Active Countries", value: "84", icon: Globe, color: "text-green-600" },
    { label: "Security Alerts", value: "0", icon: Shield, color: "text-emerald-600" },
    { label: "Storage Used", value: "42%", icon: Database, color: "text-purple-600" },
  ];

  const filteredUsers = systemUsers.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setSystemUsers(systemUsers.map(u => u.id === selectedUser.id ? selectedUser : u));
    setIsRoleModalOpen(false);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const createdUser = {
      id: `U-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: "Active",
      lastLogin: "Never"
    };
    setSystemUsers([createdUser, ...systemUsers]);
    setIsAddUserModalOpen(false);
    setNewUser({ name: "", email: "", role: "COUNTRY_DIRECTOR" });
  };

  const handleDeleteUser = (id: string) => {
    if (confirm("Are you sure you want to completely remove this user from the system?")) {
      setSystemUsers(systemUsers.filter(u => u.id !== id));
      setIsRoleModalOpen(false);
    }
  };

  const handleBroadcast = () => {
    if (!announcement.title || !announcement.content) return alert("Please fill in all fields");
    alert(`Broadcast Sent: ${announcement.title}\nTo: ${announcement.audience}\nPriority: ${announcement.priority}\nEmail Sync: ${announcement.emailSync}`);
    setAnnouncement({ title: "", content: "", audience: "All Users (Global)", priority: "Normal (Informational)", emailSync: false });
  };

  const handleResetMailConfig = (dept: string) => {
    if (confirm(`Are you sure you want to reset the global mail configuration for ${dept}? This will disconnect their inbox.`)) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`gaioMailConfig_${dept}`);
        alert(`${dept} mail configuration reset successfully.`);
      }
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
          <Shield className="h-8 w-8 text-blue-600" />
          Super Admin Command Center
        </h1>
        <p className="text-sm text-gray-500 dark:text-zinc-400">
          The ultimate control panel for managing GAIO's global digital infrastructure.
        </p>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 dark:border-zinc-800 overflow-x-auto pb-1">
        {["OVERVIEW", "USER_MANAGEMENT", "PERMISSIONS", "FINANCIALS", "ANNOUNCEMENTS", "SYSTEM_LOGS", "ENTITY_CONTROL", "GLOBAL_MAIL", "SYSTEM_CONFIG"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors relative whitespace-nowrap ${
              activeTab === tab 
              ? "text-blue-600 border-b-2 border-blue-600" 
              : "text-gray-500 hover:text-gray-700 dark:text-zinc-500 dark:hover:text-zinc-300"
            }`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {activeTab === "OVERVIEW" && (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Top Stats */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-[#111]">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg bg-gray-50 dark:bg-zinc-900 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                    <ArrowUpRight className="h-3 w-3" />
                    +12%
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="text-sm font-medium text-gray-500 dark:text-zinc-500">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* System Health */}
            <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-[#111]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-500" />
                  Real-time System Status
                </h2>
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-xs font-medium text-green-600">All Systems Operational</span>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { name: "API Gateway", status: "99.9% Uptime", latency: "24ms" },
                  { name: "Database Cluster", status: "Healthy", latency: "12ms" },
                  { name: "SMTP Relay Server", status: "Operational", latency: "115ms" },
                  { name: "IMAP Sync Engine", status: "Busy", latency: "450ms" },
                ].map((s) => (
                  <div key={s.name} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-zinc-900/50">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{s.name}</span>
                      <span className="text-[10px] text-gray-500 uppercase">{s.status}</span>
                    </div>
                    <div className="text-xs font-mono text-gray-400">{s.latency}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Audit */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-[#111]">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Lock className="h-5 w-5 text-amber-500" />
                Recent Audit Trail
              </h2>
              <div className="space-y-6">
                {auditLogs.map((log) => (
                  <div key={log.id} className="relative pl-6 pb-6 last:pb-0 border-l border-gray-100 dark:border-zinc-800">
                    <div className="absolute left-[-5px] top-0 h-2.5 w-2.5 rounded-full bg-blue-500"></div>
                    <div className="text-xs font-bold text-gray-900 dark:text-white">{log.action}</div>
                    <div className="mt-1 text-[10px] text-gray-500 flex justify-between">
                      <span>{log.user}</span>
                      <span>{log.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setActiveTab("SYSTEM_LOGS")}
                className="mt-6 w-full py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30"
              >
                View Full Audit Logs
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "USER_MANAGEMENT" && (
        <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search system users by name, email or role..." 
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full rounded-lg border-0 py-2.5 pl-10 pr-3 text-sm ring-1 ring-inset ring-gray-200 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800" 
              />
            </div>
            <button 
              onClick={() => setIsAddUserModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-500"
            >
              <Key className="h-4 w-4" />
              Grant Access
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-[#111]">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
              <thead className="bg-gray-50 dark:bg-zinc-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500">User Details</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500">System Role</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500">Last Active</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500">Status</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-zinc-800 bg-white dark:bg-[#111]">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400">
                          {user.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">{user.name}</span>
                          <span className="text-xs text-gray-500">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                        user.role === 'SUPER_ADMIN' ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' : 'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">{user.lastLogin}</td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 text-xs font-medium ${user.status === 'Active' ? 'text-green-600' : 'text-gray-400'}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-600' : 'bg-gray-400'}`}></span>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => { setSelectedUser(user); setIsRoleModalOpen(true); }}
                        className="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-bold text-xs"
                      >
                        Edit Role
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "PERMISSIONS" && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-[#111] overflow-hidden">
            <div className="p-6 border-b dark:border-zinc-800 flex justify-between items-center bg-gray-50 dark:bg-zinc-900/50">
              <div>
                <h2 className="text-lg font-bold">Global RBAC Matrix</h2>
                <p className="text-xs text-gray-500">Define granular access permissions for each system role.</p>
              </div>
              <button 
                onClick={() => alert("Permissions Matrix Saved successfully!")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold"
              >
                Save Matrix
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                <thead>
                  <tr className="bg-gray-50 dark:bg-zinc-900/20">
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase">Module / Capability</th>
                    {["ADMIN", "REGIONAL", "COUNTRY", "ORGANISER", "VOLUNTEER"].map(role => (
                      <th key={role} className="px-4 py-4 text-center text-[10px] font-bold text-gray-500 uppercase">{role}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                  {[
                    "Manage Countries", "Audit System Logs", "Configure SMTP/IMAP", 
                    "Award Tenders", "Delete Entities", "Broadcast Announcements",
                    "Manage Volunteers", "Export Data", "Access Financials"
                  ].map((perm) => (
                    <tr key={perm} className="hover:bg-gray-50/50 dark:hover:bg-zinc-900/30">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{perm}</td>
                      {["ADMIN", "REGIONAL", "COUNTRY", "ORGANISER", "VOLUNTEER"].map(role => (
                        <td key={`${perm}-${role}`} className="px-4 py-4 text-center">
                          <input 
                            type="checkbox" 
                            defaultChecked={role === 'ADMIN' || (role === 'REGIONAL' && !perm.includes('SMTP'))}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 dark:border-zinc-700 dark:bg-zinc-900" 
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "FINANCIALS" && (
        <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-gray-200 bg-white dark:border-zinc-800 dark:bg-[#111]">
              <div className="text-xs font-bold text-gray-500 uppercase mb-1">Global Budget 2026</div>
              <div className="text-3xl font-black text-gray-900 dark:text-white">$12,450,000</div>
              <div className="mt-2 text-xs text-green-600 font-bold">+8.4% vs last year</div>
            </div>
            <div className="p-6 rounded-2xl border border-gray-200 bg-white dark:border-zinc-800 dark:bg-[#111]">
              <div className="text-xs font-bold text-gray-500 uppercase mb-1">Total Sponsorships</div>
              <div className="text-3xl font-black text-blue-600">$8,920,000</div>
              <div className="mt-2 text-xs text-gray-500">18 Global Partners</div>
            </div>
            <div className="p-6 rounded-2xl border border-gray-200 bg-white dark:border-zinc-800 dark:bg-[#111]">
              <div className="text-xs font-bold text-gray-500 uppercase mb-1">Operational Spend</div>
              <div className="text-3xl font-black text-red-600">$3,120,450</div>
              <div className="mt-2 text-xs text-gray-500">Includes compute & infrastructure</div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white dark:border-zinc-800 dark:bg-[#111] overflow-hidden">
            <div className="p-6 border-b dark:border-zinc-800 flex justify-between items-center">
              <h2 className="font-bold">Regional Funding Distribution</h2>
              <button onClick={() => alert('Downloading Financial Report...')} className="text-xs font-bold text-blue-600">Export Report</button>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {[
                  { region: "Europe", amount: "$4.2M", percent: 75 },
                  { region: "Asia Pacific", amount: "$3.8M", percent: 62 },
                  { region: "Americas", amount: "$2.1M", percent: 45 },
                  { region: "Middle East & Africa", amount: "$1.2M", percent: 30 },
                ].map((r) => (
                  <div key={r.region}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-bold">{r.region}</span>
                      <span className="text-gray-500">{r.amount} allocated</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${r.percent}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "ANNOUNCEMENTS" && (
        <div className="max-w-2xl space-y-8 animate-in slide-in-from-top-4 duration-500">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-[#111]">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Global Broadcast System
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-500">Announcement Title</label>
                <input 
                  type="text" 
                  value={announcement.title}
                  onChange={(e) => setAnnouncement({...announcement, title: e.target.value})}
                  placeholder="e.g. Scheduled Maintenance" 
                  className="w-full mt-1 p-2.5 rounded-lg border dark:bg-[#1a1a1a] dark:border-zinc-800" 
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-500">Message Content</label>
                <textarea 
                  value={announcement.content}
                  onChange={(e) => setAnnouncement({...announcement, content: e.target.value})}
                  placeholder="Write your global message here..." 
                  className="w-full mt-1 p-2.5 rounded-lg border dark:bg-[#1a1a1a] dark:border-zinc-800 h-32 resize-none" 
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-[10px] font-bold uppercase text-gray-500">Target Audience</label>
                  <select 
                    value={announcement.audience}
                    onChange={(e) => setAnnouncement({...announcement, audience: e.target.value})}
                    className="w-full mt-1 p-2.5 rounded-lg border dark:bg-[#1a1a1a] dark:border-zinc-800"
                  >
                    <option>All Users (Global)</option>
                    <option>Country Directors Only</option>
                    <option>Organisers Only</option>
                    <option>Volunteers Only</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-bold uppercase text-gray-500">Priority Level</label>
                  <select 
                    value={announcement.priority}
                    onChange={(e) => setAnnouncement({...announcement, priority: e.target.value})}
                    className="w-full mt-1 p-2.5 rounded-lg border dark:bg-[#1a1a1a] dark:border-zinc-800"
                  >
                    <option>Normal (Informational)</option>
                    <option>Medium (Alert)</option>
                    <option>High (Action Required)</option>
                    <option>Critical (Emergency)</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="email-sync" 
                  checked={announcement.emailSync}
                  onChange={(e) => setAnnouncement({...announcement, emailSync: e.target.checked})}
                  className="rounded border-gray-300 text-blue-600" 
                />
                <label htmlFor="email-sync" className="text-xs text-gray-500 cursor-pointer">Also send as email to all targeted users via Global Mail Relay</label>
              </div>
              <button 
                onClick={handleBroadcast}
                className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-500"
              >
                Broadcast Announcement
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "SYSTEM_LOGS" && (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-[#111] overflow-hidden animate-in fade-in duration-500">
          <div className="p-6 border-b dark:border-zinc-800 flex justify-between items-center">
            <h2 className="text-lg font-bold">Comprehensive Audit Trail</h2>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 border dark:border-zinc-800 rounded-lg text-xs font-bold hover:bg-gray-50 dark:hover:bg-zinc-800">
                <Filter className="h-3.5 w-3.5" /> Filter Logs
              </button>
              <button 
                onClick={() => alert("Audit Logs exported to CSV!")}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white dark:bg-white dark:text-black rounded-lg text-xs font-bold"
              >
                Export CSV
              </button>
            </div>
          </div>
          <div className="p-0">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
              <thead className="bg-gray-50 dark:bg-zinc-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-500 uppercase">Timestamp</th>
                  <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-500 uppercase">Operator</th>
                  <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-500 uppercase">Action Performed</th>
                  <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-500 uppercase">Severity</th>
                  <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-500 uppercase">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                {[1,2,3,4,5,6,7,8].map((i) => (
                  <tr key={i} className="text-sm">
                    <td className="px-6 py-4 text-gray-500 text-xs">2026-03-12 14:32:0{i}</td>
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">Super Admin</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-zinc-400 font-mono text-[11px]">ADMIN_LOGIN_SUCCESS: Session created</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">INFO</span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">192.168.1.10{i}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "ENTITY_CONTROL" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in zoom-in-95 duration-500">
          {[
            { title: "Countries", count: 84, path: "/countries", icon: Globe },
            { title: "Organisers", count: 124, path: "/organisers", icon: Users },
            { title: "Events", count: 12, path: "/events", icon: CheckCircle2 },
            { title: "Tenders", count: 5, path: "/tenders", icon: Database },
            { title: "Sponsors", count: 18, path: "/sponsors", icon: Star },
            { title: "Volunteers", count: 856, path: "/volunteers", icon: Activity },
          ].map((entity) => (
            <div key={entity.title} className="p-6 rounded-2xl border border-gray-200 bg-white dark:border-zinc-800 dark:bg-[#111] hover:border-blue-500 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 group-hover:scale-110 transition-transform">
                  <entity.icon className="h-6 w-6" />
                </div>
                <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="h-5 w-5" /></button>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{entity.title}</h3>
              <p className="text-sm text-gray-500 mb-6">{entity.count} Total Records</p>
              <a href={entity.path} className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-50 dark:bg-zinc-900 rounded-xl text-sm font-bold hover:bg-blue-600 hover:text-white transition-colors">
                Open Manager
              </a>
            </div>
          ))}
        </div>
      )}

      {activeTab === "GLOBAL_MAIL" && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-[#111] overflow-hidden">
            <div className="p-6 border-b dark:border-zinc-800 flex justify-between items-center bg-gray-50 dark:bg-zinc-900/50">
              <div>
                <h2 className="text-lg font-bold">Mail Infrastructure</h2>
                <p className="text-xs text-gray-500">Centralized SMTP/IMAP configuration for all platform departments.</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600">
                <Mail className="h-5 w-5" />
              </div>
            </div>
            <div className="p-0">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                <thead className="bg-gray-50/50 dark:bg-zinc-900/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase">Department / Section</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase">Assigned Email</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase">Connection Status</th>
                    <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-zinc-800 bg-white dark:bg-[#111]">
                  {mailAccounts.map((acc) => (
                    <tr key={acc.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{acc.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 font-mono">{acc.email || 'None'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold ${
                          acc.status === 'Connected' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-100 text-gray-500'
                        }`}>
                          <span className={`h-1 w-1 rounded-full ${acc.status === 'Connected' ? 'bg-green-600' : 'bg-gray-400'}`}></span>
                          {acc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button onClick={() => handleResetMailConfig(acc.id)} className="text-red-600 hover:text-red-500 text-xs font-bold">Reset</button>
                        <button onClick={() => handleOpenMailConfig(acc.id)} className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-500">Configure</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Global Mail Modal */}
      {isMailModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl dark:bg-[#111] dark:border dark:border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Configure {activeMailDept.toUpperCase()} Mailbox</h2>
                <p className="text-xs text-gray-500 mt-1">This will automatically sync to all users in this section.</p>
              </div>
              <button onClick={() => setIsMailModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            
            <form onSubmit={handleSaveMailConfig} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">IMAP Host</label>
                  <input required value={tempMailConfig.imapHost} onChange={e => setTempMailConfig({...tempMailConfig, imapHost: e.target.value})} className="w-full p-2.5 rounded-lg border dark:bg-[#1a1a1a] dark:border-zinc-800" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">IMAP Port</label>
                  <input required value={tempMailConfig.imapPort} onChange={e => setTempMailConfig({...tempMailConfig, imapPort: e.target.value})} className="w-full p-2.5 rounded-lg border dark:bg-[#1a1a1a] dark:border-zinc-800" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">SMTP Host</label>
                  <input required value={tempMailConfig.smtpHost} onChange={e => setTempMailConfig({...tempMailConfig, smtpHost: e.target.value})} className="w-full p-2.5 rounded-lg border dark:bg-[#1a1a1a] dark:border-zinc-800" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">SMTP Port</label>
                  <input required value={tempMailConfig.smtpPort} onChange={e => setTempMailConfig({...tempMailConfig, smtpPort: e.target.value})} className="w-full p-2.5 rounded-lg border dark:bg-[#1a1a1a] dark:border-zinc-800" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Email / User</label>
                <input required type="email" value={tempMailConfig.user} onChange={e => setTempMailConfig({...tempMailConfig, user: e.target.value})} className="w-full p-2.5 rounded-lg border dark:bg-[#1a1a1a] dark:border-zinc-800" placeholder="e.g. support@gaio.uk" />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">App Password</label>
                <input required type="password" value={tempMailConfig.pass} onChange={e => setTempMailConfig({...tempMailConfig, pass: e.target.value})} className="w-full p-2.5 rounded-lg border dark:bg-[#1a1a1a] dark:border-zinc-800" placeholder="••••••••••••••••" />
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-6 border-t dark:border-zinc-800">
                <button type="button" onClick={() => setIsMailModalOpen(false)} className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 dark:text-zinc-400">Cancel</button>
                <button type="submit" className="rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-bold text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20">
                  Push Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === "SYSTEM_CONFIG" && (
        <div className="max-w-4xl space-y-8 animate-in slide-in-from-right-4 duration-500">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-[#111]">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Settings className="h-5 w-5 text-gray-400" />
              Global Platform Governance
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl border dark:border-zinc-800">
                <div className="flex flex-col">
                  <span className="text-sm font-bold">Maintenance Mode</span>
                  <span className="text-xs text-gray-500">When enabled, only Super Admins can access the platform.</span>
                </div>
                <button 
                  onClick={() => setSysConfig({...sysConfig, maintenance: !sysConfig.maintenance})}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${sysConfig.maintenance ? 'bg-red-600' : 'bg-gray-200 dark:bg-zinc-800'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${sysConfig.maintenance ? 'translate-x-5' : 'translate-x-0'}`}></span>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border dark:border-zinc-800">
                <div className="flex flex-col">
                  <span className="text-sm font-bold">New Organiser Registration</span>
                  <span className="text-xs text-gray-500">Allow new organisations to apply for national status.</span>
                </div>
                <button 
                  onClick={() => setSysConfig({...sysConfig, registration: !sysConfig.registration})}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${sysConfig.registration ? 'bg-blue-600' : 'bg-gray-200 dark:bg-zinc-800'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${sysConfig.registration ? 'translate-x-5' : 'translate-x-0'}`}></span>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border dark:border-zinc-800">
                <div className="flex flex-col">
                  <span className="text-sm font-bold">Public Tender Portal</span>
                  <span className="text-xs text-gray-500">Make the tenders section visible to guest users.</span>
                </div>
                <button 
                  onClick={() => setSysConfig({...sysConfig, publicTenders: !sysConfig.publicTenders})}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${sysConfig.publicTenders ? 'bg-blue-600' : 'bg-gray-200 dark:bg-zinc-800'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${sysConfig.publicTenders ? 'translate-x-5' : 'translate-x-0'}`}></span>
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-[#111]">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Database className="h-5 w-5 text-gray-400" />
              Infrastructure & API Gateway
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-500">Global API Key</label>
                <div className="flex gap-2">
                  <input type="password" value="********************************" readOnly className="flex-1 p-2.5 rounded-lg border dark:bg-zinc-900 dark:border-zinc-800 text-xs font-mono" />
                  <button onClick={() => alert("API Key Rotated!")} className="px-3 py-2 bg-gray-100 dark:bg-zinc-800 rounded-lg text-xs font-bold hover:bg-gray-200">Rotate</button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-500">Backup Frequency</label>
                <select className="w-full p-2.5 rounded-lg border dark:bg-zinc-900 dark:border-zinc-800 text-sm">
                  <option>Every 6 Hours</option>
                  <option>Daily (Midnight)</option>
                  <option>Weekly</option>
                </select>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button 
                onClick={() => alert("Global System Configurations applied successfully.")}
                className="bg-blue-600 text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-500"
              >
                Apply System Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl dark:bg-[#111] dark:border dark:border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Grant Access</h2>
              <button onClick={() => setIsAddUserModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Full Name</label>
                <input required type="text" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} className="w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email Address</label>
                <input required type="email" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} className="w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">System Role</label>
                <select value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})} className="w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800">
                  <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  <option value="GLOBAL_ADMIN">GLOBAL_ADMIN</option>
                  <option value="REGIONAL_COORDINATOR">REGIONAL_COORDINATOR</option>
                  <option value="COUNTRY_DIRECTOR">COUNTRY_DIRECTOR</option>
                  <option value="VOLUNTEER_LEAD">VOLUNTEER_LEAD</option>
                </select>
              </div>
              <div className="mt-8 flex justify-end gap-3 pt-4 border-t dark:border-zinc-800">
                <button type="button" onClick={() => setIsAddUserModalOpen(false)} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800">Cancel</button>
                <button type="submit" className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-bold text-white hover:bg-blue-500">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {isRoleModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl dark:bg-[#111] dark:border dark:border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Manage User</h2>
              <button onClick={() => setIsRoleModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Status</label>
                <select value={selectedUser.status} onChange={(e) => setSelectedUser({...selectedUser, status: e.target.value})} className="w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">System Role</label>
                <select value={selectedUser.role} onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})} className="w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800">
                  <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  <option value="GLOBAL_ADMIN">GLOBAL_ADMIN</option>
                  <option value="REGIONAL_COORDINATOR">REGIONAL_COORDINATOR</option>
                  <option value="COUNTRY_DIRECTOR">COUNTRY_DIRECTOR</option>
                  <option value="VOLUNTEER_LEAD">VOLUNTEER_LEAD</option>
                </select>
              </div>
              <div className="mt-8 flex justify-between items-center pt-6 border-t dark:border-zinc-800">
                <button type="button" onClick={() => handleDeleteUser(selectedUser.id)} className="text-sm font-bold text-red-600 hover:text-red-500">Revoke Access</button>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setIsRoleModalOpen(false)} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800">Cancel</button>
                  <button type="submit" className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-bold text-white hover:bg-blue-500">Update Role</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
