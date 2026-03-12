"use client";

import { useState } from "react";
import { User, GraduationCap, Clock, CheckCircle2, Search, Plus, Filter, Tag, MapPin, X } from "lucide-react";

const initialVolunteers = [
  { id: "V-001", name: "Alice Thompson", university: "Stanford University", skills: ["AI Ethics", "Logistics"], status: "Assigned", event: "Tokyo AI Challenge", email: "alice.t@stanford.edu" },
  { id: "V-002", name: "Robert Chen", university: "Oxford University", skills: ["Python", "Mentorship"], status: "Approved", event: "N/A", email: "r.chen@ox.ac.uk" },
  { id: "V-003", name: "Sarah Jenkins", university: "MIT", skills: ["Event Coordination", "PR"], status: "Assigned", event: "London AI Open", email: "sjenkins@mit.edu" },
  { id: "V-004", name: "Kevin Lee", university: "National University of Singapore", skills: ["Public Speaking"], status: "Applied", event: "N/A", email: "kevin.lee@u.nus.edu" },
  { id: "V-005", name: "Elena Rodriguez", university: "University of Barcelona", skills: ["Data Science", "Spanish"], status: "Approved", event: "N/A", email: "elena.rod@ub.edu" },
];

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState(initialVolunteers);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<any>(null);

  // Forms state
  const [formData, setFormData] = useState({ name: "", university: "", skills: "", email: "" });
  const [manageData, setManageData] = useState<any>(null);

  const filteredVolunteers = volunteers.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "ALL" || v.status.toUpperCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddVolunteer = (e: React.FormEvent) => {
    e.preventDefault();
    const newV = {
      id: `V-00${volunteers.length + 1}`,
      name: formData.name,
      university: formData.university,
      skills: formData.skills.split(',').map(s => s.trim()),
      status: "Applied",
      event: "N/A",
      email: formData.email
    };
    setVolunteers([newV, ...volunteers]);
    setFormData({ name: "", university: "", skills: "", email: "" });
    setIsModalOpen(false);
  };

  const handleOpenManage = (v: any) => {
    setSelectedVolunteer(v);
    setManageData({ ...v, skills: v.skills.join(", ") });
    setIsManageOpen(true);
  };

  const handleUpdateVolunteer = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = volunteers.map(v => 
      v.id === selectedVolunteer.id 
        ? { 
            ...manageData, 
            skills: typeof manageData.skills === 'string' ? manageData.skills.split(',').map((s: string) => s.trim()) : manageData.skills 
          } 
        : v
    );
    setVolunteers(updated);
    setIsManageOpen(false);
  };

  const handleDeleteVolunteer = (id: string) => {
    if (confirm("Are you sure you want to remove this volunteer?")) {
      setVolunteers(volunteers.filter(v => v.id !== id));
      setIsManageOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Volunteer Network</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
            Coordinate global volunteer applications and event assignments.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" />
            New Application
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-zinc-800 dark:bg-[#111]">
          <div className="text-xs font-bold text-gray-500 uppercase">Total Volunteers</div>
          <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{volunteers.length}</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-zinc-800 dark:bg-[#111]">
          <div className="text-xs font-bold text-gray-500 uppercase">Active Assignments</div>
          <div className="mt-1 text-2xl font-bold text-green-600">{volunteers.filter(v => v.status === 'Assigned').length}</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-zinc-800 dark:bg-[#111]">
          <div className="text-xs font-bold text-gray-500 uppercase">Pending Review</div>
          <div className="mt-1 text-2xl font-bold text-amber-500">{volunteers.filter(v => v.status === 'Applied').length}</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search volunteers by name, university or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border-0 py-2.5 pl-10 pr-3 text-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {["ALL", "APPLIED", "APPROVED", "ASSIGNED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
                statusFilter === status 
                ? "bg-blue-600 text-white" 
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-[#111] overflow-hidden">
        <ul className="divide-y divide-gray-200 dark:divide-zinc-800">
          {filteredVolunteers.length > 0 ? (
            filteredVolunteers.map((v) => (
              <li key={v.id} className="p-6 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400">
                      {v.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">{v.name}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <GraduationCap className="h-3.5 w-3.5" />
                          {v.university}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Tag className="h-3.5 w-3.5" />
                          <div className="flex gap-1">
                            {v.skills.map(skill => (
                              <span key={skill} className="px-1.5 py-0.5 bg-gray-100 dark:bg-zinc-800 rounded text-[10px] font-medium">{skill}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-6 lg:gap-12">
                    <div className="min-w-[120px]">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Current Assignment</div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-zinc-300">
                        {v.event === 'N/A' ? <span className="text-gray-400 italic font-normal">No assignment</span> : v.event}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${
                        v.status === 'Assigned' ? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/20 dark:text-green-400' :
                        v.status === 'Approved' ? 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-900/20 dark:text-blue-400' :
                        v.status === 'Applied' ? 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-900/20 dark:text-amber-500' :
                        'bg-gray-50 text-gray-600 ring-gray-500/10 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}>
                        {v.status}
                      </span>
                      <button 
                        onClick={() => handleOpenManage(v)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-500 dark:text-blue-400"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <div className="p-12 text-center text-gray-500 italic opacity-50">
              No volunteers match your current filters.
            </div>
          )}
        </ul>
      </div>

      {/* Add Volunteer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl dark:bg-[#111] dark:border dark:border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">New Volunteer Registration</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleAddVolunteer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">University</label>
                <input
                  type="text"
                  required
                  value={formData.university}
                  onChange={(e) => setFormData({...formData, university: e.target.value})}
                  className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800"
                  placeholder="e.g. Harvard University"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800"
                  placeholder="john@university.edu"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Skills (Comma separated)</label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({...formData, skills: e.target.value})}
                  className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800"
                  placeholder="e.g. AI Ethics, Logistics, PR"
                />
              </div>
              <div className="mt-8 flex justify-end gap-3 pt-4 border-t dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-bold text-white hover:bg-blue-500 shadow-lg shadow-blue-500/30">
                  Register Volunteer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Volunteer Modal */}
      {isManageOpen && manageData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl dark:bg-[#111] dark:border dark:border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Manage Volunteer: {selectedVolunteer.name}</h2>
              <button onClick={() => setIsManageOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            
            <form onSubmit={handleUpdateVolunteer} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Status</label>
                  <select 
                    value={manageData.status}
                    onChange={(e) => setManageData({...manageData, status: e.target.value})}
                    className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Approved">Approved</option>
                    <option value="Assigned">Assigned</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Assigned Event</label>
                  <input
                    type="text"
                    value={manageData.event}
                    onChange={(e) => setManageData({...manageData, event: e.target.value})}
                    className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">University</label>
                <input
                  type="text"
                  value={manageData.university}
                  onChange={(e) => setManageData({...manageData, university: e.target.value})}
                  className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email Address</label>
                <input
                  type="email"
                  value={manageData.email}
                  onChange={(e) => setManageData({...manageData, email: e.target.value})}
                  className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Skills (Comma separated)</label>
                <input
                  type="text"
                  value={manageData.skills}
                  onChange={(e) => setManageData({...manageData, skills: e.target.value})}
                  className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800"
                />
              </div>

              <div className="mt-8 flex justify-between items-center pt-6 border-t dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => handleDeleteVolunteer(selectedVolunteer.id)}
                  className="text-sm font-bold text-red-600 hover:text-red-500"
                >
                  Remove Volunteer
                </button>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsManageOpen(false)}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-bold text-white hover:bg-blue-500">
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
