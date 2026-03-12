import { Settings as SettingsIcon, Shield, Bell, Globe, User } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8 pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Platform Settings</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
          Configure global platform settings, user permissions, and notifications.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 max-w-4xl">
        <section className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-[#111]">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Security & Access</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Role-Based Access Control</div>
                  <div className="text-xs text-gray-500">Configure permissions for all 7 user roles.</div>
                </div>
                <button className="text-sm font-medium text-blue-600 dark:text-blue-400">Manage</button>
              </div>
              <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-zinc-800">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Audit Logs</div>
                  <div className="text-xs text-gray-500">View detailed system activity and security logs.</div>
                </div>
                <button className="text-sm font-medium text-blue-600 dark:text-blue-400">View Logs</button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-[#111]">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Global Configuration</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Regional Definitions</div>
                  <div className="text-xs text-gray-500">Define and manage geographical operational regions.</div>
                </div>
                <button className="text-sm font-medium text-blue-600 dark:text-blue-400">Configure</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
