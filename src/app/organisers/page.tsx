"use client";

import { useState } from "react";
import { Plus, Search, Mail, Phone, MapPin, X } from "lucide-react";

const initialOrganisers = [
  { id: "ORG-001", name: "TechEd UK", country: "United Kingdom", contact: "James Wilson", email: "james@teched.uk", teamSize: 12, status: "Approved" },
  { id: "ORG-002", name: "Japan AI Foundation", country: "Japan", contact: "Yuki Tanaka", email: "y.tanaka@jaif.jp", teamSize: 24, status: "Approved" },
  { id: "ORG-003", name: "EducaTech Brazil", country: "Brazil", contact: "Carlos Silva", email: "carlos@educatech.br", teamSize: 8, status: "Approved" },
  { id: "ORG-004", name: "AfriAI Connect", country: "South Africa", contact: "Zanele Mbeki", email: "z.mbeki@afriai.org", teamSize: 15, status: "Under Review" },
  { id: "ORG-005", name: "Nordic AI Lab", country: "Sweden", contact: "Erik Larsson", email: "erik@nordicai.se", teamSize: 6, status: "Applied" },
];

export default function OrganisersPage() {
  const [organisers, setOrganisers] = useState(initialOrganisers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", country: "", contact: "", email: "" });

  const [isManageOpen, setIsManageOpen] = useState(false);
  const [manageData, setManageData] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const newOrg = {
      id: `ORG-00${organisers.length + 1}`,
      name: formData.name,
      country: formData.country,
      contact: formData.contact,
      email: formData.email,
      teamSize: 0,
      status: "Applied"
    };

    setOrganisers([newOrg, ...organisers]);
    setFormData({ name: "", country: "", contact: "", email: "" });
    setIsModalOpen(false);
  };

  const handleOpenManage = (org: any) => {
    setManageData(org);
    setIsManageOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setOrganisers(organisers.map(org => org.id === manageData.id ? manageData : org));
    setIsManageOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this organiser?")) {
      setOrganisers(organisers.filter(org => org.id !== id));
      setIsManageOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Organiser Management</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
            Review and manage national and regional event organisers.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            onClick={() => setIsModalOpen(true)}
            type="button"
            className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Organiser
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {organisers.map((org) => (
          <div key={org.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-[#111]">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-zinc-800">
                  <span className="text-lg font-bold text-gray-600 dark:text-zinc-400">{org.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{org.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-zinc-400">
                    <MapPin className="h-3 w-3" />
                    {org.country}
                  </div>
                </div>
              </div>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                org.status === 'Approved' ? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/20 dark:text-green-400' :
                org.status === 'Under Review' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20 dark:bg-yellow-900/20 dark:text-yellow-500' :
                'bg-gray-50 text-gray-600 ring-gray-500/10 dark:bg-zinc-800 dark:text-zinc-400'
              }`}>
                {org.status}
              </span>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 dark:border-zinc-800">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-400">
                <Mail className="h-4 w-4" />
                {org.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-400">
                <Phone className="h-4 w-4" />
                {org.contact}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-zinc-500">Team Size: {org.teamSize}</span>
              <button onClick={() => handleOpenManage(org)} className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">Manage</button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl dark:bg-[#111] dark:border dark:border-zinc-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Organiser</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Organisation Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Country</label>
                  <input type="text" required value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Contact Person</label>
                  <input type="text" required value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Email</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800" />
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800">Cancel</button>
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500">Save Organiser</button>
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
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Manage Organiser: {manageData.name}</h2>
              <button onClick={() => setIsManageOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Status</label>
                  <select value={manageData.status} onChange={(e) => setManageData({...manageData, status: e.target.value})} className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800">
                    <option value="Applied">Applied</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Country</label>
                  <input type="text" value={manageData.country} onChange={(e) => setManageData({...manageData, country: e.target.value})} className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Contact Person</label>
                  <input type="text" value={manageData.contact} onChange={(e) => setManageData({...manageData, contact: e.target.value})} className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Team Size</label>
                  <input type="number" value={manageData.teamSize} onChange={(e) => setManageData({...manageData, teamSize: parseInt(e.target.value) || 0})} className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email</label>
                <input type="email" value={manageData.email} onChange={(e) => setManageData({...manageData, email: e.target.value})} className="block w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-blue-600 dark:bg-[#1a1a1a] dark:text-white dark:ring-zinc-800" />
              </div>

              <div className="mt-8 flex justify-between items-center pt-6 border-t dark:border-zinc-800">
                <button type="button" onClick={() => handleDelete(manageData.id)} className="text-sm font-bold text-red-600 hover:text-red-500">Remove Organiser</button>
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
