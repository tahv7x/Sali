import type { Metadata } from "next";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export const metadata: Metadata = {
  title: "Boards — Sali",
  description: "Your recent Sali task boards.",
};

export default function BoardsPage() {
  return <DashboardView />;
}
