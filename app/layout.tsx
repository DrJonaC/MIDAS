import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { PensieveProvider } from "@/lib/session";
import "./globals.css";

export const metadata: Metadata = {
  title: "MIDAS — Memory Integrity and Drift-Aware Safeguard",
  description: "Detect Context-Drift Violations in real time — guard what your agent knows about you."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-body">
        <PensieveProvider>
          <AppShell>{children}</AppShell>
        </PensieveProvider>
      </body>
    </html>
  );
}
