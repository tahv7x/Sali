import type { Metadata } from "next";
import { AppExperience } from "@/components/app-experience";
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
        <AppExperience navigation={<GlobalNavigation />}>
          {children}
        </AppExperience>
      </body>
    </html>
  );
}
