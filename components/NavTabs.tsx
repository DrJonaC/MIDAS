"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Home" },
  { href: "/guide", label: "Guide" },
  { href: "/user-view", label: "User View" },
  { href: "/surface-model", label: "Surface Model" }
];

export function NavTabs() {
  const pathname = usePathname();

  return (
    <nav className="mystic-panel-soft flex flex-wrap gap-2 rounded-full p-1.5">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`rounded-full px-4 py-2 text-sm transition ${
              isActive
                ? "border border-glow/35 bg-gradient-to-r from-glow/20 to-cyan-300/10 text-white shadow-pulse"
                : "border border-transparent bg-transparent text-mist hover:border-white/10 hover:bg-white/[0.05] hover:text-white"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
