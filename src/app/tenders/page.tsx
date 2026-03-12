"use client";

import { useState } from "react";
import { Plus, Search, Filter, X } from "lucide-react";

const initialTenders = [
  { id: "TND-2026-EU", title: "European Regional Finals 2026", type: "Regional", region: "Europe", budget: "$150k - $250k", deadline: "Mar 15, 2026", status: "Under Review" },
  { id: "TND-2026-UK", title: "UK National Competition", type: "National", region: "United Kingdom", budget: "$50k - $80k", deadline: "Mar 10, 2026", status: "Awarded" },
  { id: "TND-2026-JP", title: "Japan National Event", type: "National", region: "Japan", budget: "$80k - $120k", deadline: "Mar 22, 2026", status: "Open" },
  { id: "TND-2027-GL", title: "GAIO Global Finals 2027", type: "Global", region: "Global", budget: "$2M - $3M", deadline: "Apr 01, 2026", status: "Open" },
  { id: "TND-2026-NG", title: "Nigeria National Qualifiers", type: "National", region: "Nigeria", budget: "$20k - $40k", deadline: "Mar 28, 2026", status: "Open" },
];

export default function TendersPage() {
  const [tenders, setTenders] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gaio_tenders');
      if (saved) return JSON.parse(saved);
    }
    return initialTenders;
  });

  const saveToStore = (data: any) => {
    setTenders(data);
    localStorage.setItem('gaio_tenders', JSON.stringify(data));
  };

  const runAutomation = (tender: any) => {
    if (tender.status === 'Awarded') {
      // 1. Create Organiser automatically
      const organisersSaved = localStorage.getItem('gaio_organisers');
      const organisers = organisersSaved ? JSON.parse(organisersSaved) : [];
      const newOrg = {
        id: `ORG-${Date.now()}`,
        name: `Org for ${tender.title}`,
        country: tender.region,
        contact: "Assigned via Tender",
        email: "auto@tender.gaio.uk",
        teamSize: 0,
        status: "Approved"
      };
      localStorage.setItem('gaio_organisers', JSON.stringify([newOrg, ...organisers]));

      // 2. Create Event automatically
      const eventsSaved = localStorage.getItem('gaio_events');
      const events = eventsSaved ? JSON.parse(eventsSaved) : [];
      const newEvent = {
        id: `EVT-${Date.now()}`,
        name: tender.title,
        type: tender.type,
        country: tender.region,
        date: tender.deadline,
        status: "Planning",
        participants: "0"
      };
      localStorage.setItem('gaio_events', JSON.stringify([newEvent, ...events]));
      
      alert(`AUTOMATION TRIGGERED: An Organiser and Event have been automatically provisioned for "${tender.title}".`);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", type: "National", region: "", budget: "", deadline: "" });

  const [isManageOpen, setIsManageOpen] = useState(false);
  const [manageData, setManageData] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const newTender = {
      id: `TND-${new Date().getFullYear()}-${formData.region.substring(0,2).toUpperCase()}`,
      title: formData.title,
      type: formData.type,
      region: formData.region,
      budget: formData.budget || "TBD",
      deadline: formData.deadline || "TBD",
      status: "Open"
    };

    saveToStore([newTender, ...tenders]);
    setFormData({ title: "", type: "National", region: "", budget: "", deadline: "" });
    setIsModalOpen(false);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = tenders.map((t: any) => t.id === manageData.id ? manageData : t);
    saveToStore(updated);
    runAutomation(manageData);
    setIsManageOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this tender?")) {
      saveToStore(tenders.filter((t: any) => t.id !== id));
      setIsManageOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Tender Management</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
            Create, review, and award tenders for global, regional, and national events.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            onClick={() => setIsModalOpen(true)}
            type="button"
            className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Tender
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-[#111] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
            <thead className="bg-gray-50 dark:bg-zinc-900/50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-zinc-300 sm:pl-6">Tender Details</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-zinc-300">Type & Region</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-zinc-300">Budget Estimate</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-zinc-300">Deadline</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-zinc-300">Status</th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-zinc-800 bg-white dark:bg-[#111]">
              {tenders.map((tender) => (
                <tr key={tender.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{tender.title}</span>
                      <span className="text-sm text-gray-500 dark:text-zinc-400">{tender.id}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-900 dark:text-white">{tender.type}</span>
                      <span className="text-sm text-gray-500 dark:text-zinc-400">{tender.region}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-zinc-400">
                    {tender.budget}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-zinc-400">
                    {tender.deadline}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                      tender.status === 'Open' ? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/20 dark:text-green-400' :
                      tender.status === 'Under Review' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20 dark:bg-yellow-900/20 dark:text-yellow-500' :
                      'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-900/20 dark:text-blue-400'
                    }`}>
                      {tender.status}
                    </span>
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button onClick={() => handleOpenManage(tender)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl dark:bg-[#111] dark:border dark:border-zinc-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Create New Tender</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Tender Title</label>
                  <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Event Type</label>
                  <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800">
                    <option value="National">National</option>
                    <option value="Regional">Regional</option>
                    <option value="Global">Global</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Target Region/Country</label>
                  <input type="text" required value={formData.region} onChange={(e) => setFormData({...formData, region: e.target.value})} className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Budget</label>
                    <input type="text" placeholder="e.g. $50k" value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})} className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Deadline</label>
                    <input type="text" placeholder="e.g. Mar 30, 2026" value={formData.deadline} onChange={(e) => setFormData({...formData, deadline: e.target.value})} className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800" />
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800">Cancel</button>
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500">Publish Tender</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Modal */}
      {isManageOpen && manageData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl dark:bg-[#111] dark:border dark:border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Manage Tender</h2>
              <button onClick={() => setIsManageOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Title</label>
                <input type="text" value={manageData.title} onChange={(e) => setManageData({...manageData, title: e.target.value})} className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Status</label>
                  <select value={manageData.status} onChange={(e) => setManageData({...manageData, status: e.target.value})} className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800">
                    <option value="Open">Open</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Awarded">Awarded</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Type</label>
                  <select value={manageData.type} onChange={(e) => setManageData({...manageData, type: e.target.value})} className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800">
                    <option value="National">National</option>
                    <option value="Regional">Regional</option>
                    <option value="Global">Global</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Region</label>
                <input type="text" value={manageData.region} onChange={(e) => setManageData({...manageData, region: e.target.value})} className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Budget</label>
                  <input type="text" value={manageData.budget} onChange={(e) => setManageData({...manageData, budget: e.target.value})} className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Deadline</label>
                  <input type="text" value={manageData.deadline} onChange={(e) => setManageData({...manageData, deadline: e.target.value})} className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800" />
                </div>
              </div>
              <div className="mt-8 flex justify-between items-center pt-6 border-t dark:border-zinc-800">
                <button type="button" onClick={() => handleDelete(manageData.id)} className="text-sm font-bold text-red-600 hover:text-red-500">Delete Tender</button>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setIsManageOpen(false)} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800">Cancel</button>
                  <button type="submit" className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-bold text-white hover:bg-blue-500">Save Changes</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
