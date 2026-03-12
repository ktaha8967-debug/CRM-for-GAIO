"use client";

import dynamic from "next/dynamic";
import { 
  Users, 
  Globe, 
  CalendarDays, 
  Building2, 
  TrendingUp, 
  ArrowUpRight 
} from "lucide-react";

const ParticipationChart = dynamic(() => import("@/components/DashboardCharts").then(mod => mod.ParticipationChart), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full animate-pulse bg-gray-50 dark:bg-zinc-900/50 rounded-xl" />
});

const RegionChart = dynamic(() => import("@/components/DashboardCharts").then(mod => mod.RegionChart), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full animate-pulse bg-gray-50 dark:bg-zinc-900/50 rounded-xl" />
});

const stats = [
  { name: "Total Students", value: "84,900", change: "+12.5%", icon: Users },
  { name: "Active Countries", value: "107", change: "+4", icon: Globe },
  { name: "Scheduled Events", value: "145", change: "+24", icon: CalendarDays },
  { name: "Global Sponsors", value: "32", change: "+2", icon: Building2 },
];

const recentTenders = [
  { id: "TND-2026-EU", title: "European Regional Finals 2026", status: "Under Review", date: "Mar 15, 2026", type: "Regional" },
  { id: "TND-2026-UK", title: "UK National Competition", status: "Awarded", date: "Mar 10, 2026", type: "National" },
  { id: "TND-2026-JP", title: "Japan National Event", status: "Open", date: "Mar 22, 2026", type: "National" },
  { id: "TND-2027-GL", title: "GAIO Global Finals 2027", status: "Open", date: "Apr 01, 2026", type: "Global" },
];

export default function GlobalDashboard() {
  return (
    <div className="flex flex-col gap-8 pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Global Command Dashboard</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
          Overview of the Global AI Olympiad operations and international event infrastructure.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-[#111]"
          >
            <dt>
              <div className="absolute rounded-md bg-blue-50 p-3 dark:bg-blue-900/20">
                <stat.icon className="h-6 w-6 text-blue-700 dark:text-blue-400" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500 dark:text-zinc-400">
                {stat.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-1 sm:pb-2">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600 dark:text-green-400">
                <TrendingUp className="mr-1 h-4 w-4 shrink-0 self-center text-green-500" />
                {stat.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-[#111]">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Student Participation (YTD)</h2>
          <ParticipationChart />
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-[#111]">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Active Countries by Region</h2>
          <RegionChart />
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-[#111]">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5 dark:border-zinc-800">
          <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">Active Tenders & Events</h3>
          <a href="/tenders" className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center gap-1 dark:text-blue-400">
            View all <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
        <div className="px-6 py-5">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-zinc-300 sm:pl-0">Tender ID</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-zinc-300">Title</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-zinc-300">Type</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-zinc-300">Deadline</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-zinc-300">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                  {recentTenders.map((tender) => (
                    <tr key={tender.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-0">
                        {tender.id}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-zinc-400">{tender.title}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-zinc-400">{tender.type}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-zinc-400">{tender.date}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                          tender.status === 'Open' ? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/20 dark:text-green-400 dark:ring-green-500/20' :
                          tender.status === 'Under Review' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20 dark:bg-yellow-900/20 dark:text-yellow-500 dark:ring-yellow-500/20' :
                          'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-900/20 dark:text-blue-400 dark:ring-blue-500/20'
                        }`}>
                          {tender.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
