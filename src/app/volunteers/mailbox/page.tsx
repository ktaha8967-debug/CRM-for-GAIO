"use client";

import MailboxView from "@/components/MailboxView";

export default function VolunteersMailboxPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Volunteer Network Communications</h1>
        <p className="text-sm text-gray-500 dark:text-zinc-400">Manage all official emails with global volunteers and university partners.</p>
      </div>
      <MailboxView title="Volunteer Mailbox" configKey="gaioMailConfig_volunteers" />
    </div>
  );
}
