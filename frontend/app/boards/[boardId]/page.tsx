import type { Metadata } from "next";
import { TaskBoard } from "@/components/board/task-board";

type BoardPageProps = {
  params: Promise<{ boardId: string }>;
};

export async function generateMetadata({ params }: BoardPageProps): Promise<Metadata> {
  const { boardId } = await params;
  const title = formatBoardTitle(boardId);
  return {
    title: `${title} — Sali`,
    description: `${title} task board preview.`,
  };
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { boardId } = await params;
  return <TaskBoard boardTitle={formatBoardTitle(boardId)} />;
}

function formatBoardTitle(value: string) {
  return decodeURIComponent(value)
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
