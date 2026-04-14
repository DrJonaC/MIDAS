"use client";

import Link from "next/link";
import { ModeToggle } from "@/components/ModeToggle";
import { NavTabs } from "@/components/NavTabs";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="pensieve-stage">
      <div className="wisps" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="relative z-10 mx-auto min-h-screen max-w-7xl px-5 py-6 md:px-8 md:py-8">
        <header className="mystic-panel rounded-[2rem] px-5 py-4 md:px-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <Link href="/" className="min-w-fit">
              <p className="text-xs uppercase tracking-[0.32em] text-glow/80">Pensieve / Ming Xiang Pen</p>
              <h1 className="mt-2 font-display text-2xl font-semibold tracking-wide text-white">Memory Surface</h1>
            </Link>

            <div className="flex flex-col gap-4 xl:items-end">
              <NavTabs />
              <ModeToggle />
            </div>
          </div>
        </header>

        <div className="relative z-10 mt-8">{children}</div>
      </div>
    </div>
  );
}
