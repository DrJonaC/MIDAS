import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { PensieveProvider } from "@/lib/session";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pensieve",
  description: "Observe, interpret, and manage how an LLM remembers you."
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
