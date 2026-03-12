"use client";

import MailboxView from "@/components/MailboxView";

export default function OrganisersMailboxPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Organiser Communications</h1>
        <p className="text-sm text-gray-500 dark:text-zinc-400">Manage all official emails with national and regional organisers.</p>
      </div>
      <MailboxView title="Organiser Mailbox" configKey="gaioMailConfig_organisers" />
    </div>
  );
}
