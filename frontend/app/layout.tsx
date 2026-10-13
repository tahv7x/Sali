import type { Metadata } from "next";
import { GlobalNavigation } from "@/components/global-navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sali — Task Board",
  description: "A focused, beautifully simple task board.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GlobalNavigation />
        <main className="min-h-[calc(100vh-44px)] bg-studio-mist">{children}</main>
      </body>
    </html>
  );
}
