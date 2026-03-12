"use client";

import { useState } from "react";
import { Building2, Plus, X } from "lucide-react";

const initialSponsors = [
  { id: "S-1", name: "Global AI Tech", tier: "Global Strategic Partner", industry: "Technology", funding: "$500,000", status: "Active" },
  { id: "S-2", name: "Future Finance", tier: "Innovation Partner", industry: "Finance", funding: "$250,000", status: "Active" },
  { id: "S-3", name: "Cloud Systems Inc", tier: "Technology Partner", industry: "Cloud Computing", funding: "$150,000", status: "Pending" },
  { id: "S-4", name: "EduWorld", tier: "Education Partner", industry: "Education", funding: "$100,000", status: "Active" },
];

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gaio_sponsors');
      if (saved) return JSON.parse(saved);
    }
    return initialSponsors;
  });

  const saveToStore = (data: any) => {
    setSponsors(data);
    localStorage.setItem('gaio_sponsors', JSON.stringify(data));
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", tier: "Technology Partner", industry: "", funding: "" });

  const [isManageOpen, setIsManageOpen] = useState(false);
  const [manageData, setManageData] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const newSponsor = {
      id: `S-${Date.now()}`,
      name: formData.name,
      tier: formData.tier,
      industry: formData.industry || "General",
      funding: formData.funding || "TBD",
      status: "Pending"
    };

    saveToStore([newSponsor, ...sponsors]);
    setFormData({ name: "", tier: "Technology Partner", industry: "", funding: "" });
    setIsModalOpen(false);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    saveToStore(sponsors.map((s: any) => s.id === manageData.id ? manageData : s));
    setIsManageOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this partner?")) {
      saveToStore(sponsors.filter((s: any) => s.id !== id));
      setIsManageOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Sponsors & Partners</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
            Manage corporate partnerships and institutional collaborations.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            onClick={() => setIsModalOpen(true)}
            type="button"
            className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Partner
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {sponsors.map((sponsor) => (
          <div key={sponsor.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-[#111]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20 mb-4">
              <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{sponsor.name}</h3>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mt-1">{sponsor.tier}</p>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-zinc-400">Industry</span>
                <span className="text-gray-900 dark:text-white font-medium">{sponsor.industry}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-zinc-400">Funding</span>
                <span className="text-gray-900 dark:text-white font-medium">{sponsor.funding}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-zinc-400">Status</span>
                <span className={`font-medium ${sponsor.status === 'Active' ? 'text-green-600' : 'text-amber-500'}`}>{sponsor.status}</span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800 flex justify-end">
              <button onClick={() => handleOpenManage(sponsor)} className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">Manage Partner</button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl dark:bg-[#111] dark:border dark:border-zinc-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Partner</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Company Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Tier</label>
                  <select value={formData.tier} onChange={(e) => setFormData({...formData, tier: e.target.value})} className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800">
                    <option value="Global Strategic Partner">Global Strategic Partner</option>
                    <option value="Innovation Partner">Innovation Partner</option>
                    <option value="Technology Partner">Technology Partner</option>
                    <option value="Education Partner">Education Partner</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Industry</label>
                  <input type="text" value={formData.industry} onChange={(e) => setFormData({...formData, industry: e.target.value})} className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Funding Amount</label>
                  <input type="text" placeholder="e.g. $100,000" value={formData.funding} onChange={(e) => setFormData({...formData, funding: e.target.value})} className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800" />
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800">Cancel</button>
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500">Save Partner</button>
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
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Manage Partner: {manageData.name}</h2>
              <button onClick={() => setIsManageOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Status</label>
                  <select value={manageData.status} onChange={(e) => setManageData({...manageData, status: e.target.value})} className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800">
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Tier</label>
                  <select value={manageData.tier} onChange={(e) => setManageData({...manageData, tier: e.target.value})} className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800">
                    <option value="Global Strategic Partner">Global Strategic Partner</option>
                    <option value="Innovation Partner">Innovation Partner</option>
                    <option value="Technology Partner">Technology Partner</option>
                    <option value="Education Partner">Education Partner</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Industry</label>
                  <input type="text" value={manageData.industry} onChange={(e) => setManageData({...manageData, industry: e.target.value})} className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Funding Amount</label>
                  <input type="text" value={manageData.funding} onChange={(e) => setManageData({...manageData, funding: e.target.value})} className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800" />
                </div>
              </div>

              <div className="mt-8 flex justify-between items-center pt-6 border-t dark:border-zinc-800">
                <button type="button" onClick={() => handleDelete(manageData.id)} className="text-sm font-bold text-red-600 hover:text-red-500">Remove Partner</button>
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
