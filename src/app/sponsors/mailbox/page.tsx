"use client";

import MailboxView from "@/components/MailboxView";

export default function SponsorsMailboxPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Sponsor & Partner Communications</h1>
        <p className="text-sm text-gray-500 dark:text-zinc-400">Manage all official emails with global sponsors and strategic partners.</p>
      </div>
      <MailboxView title="Sponsors Mailbox" configKey="gaioMailConfig_sponsors" />
    </div>
  );
}
