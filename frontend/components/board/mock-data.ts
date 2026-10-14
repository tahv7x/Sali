export type Priority = "High" | "Medium" | "Low";

export type Assignee = {
  initials: string;
  name: string;
};

export type Subtask = {
  done: boolean;
  title: string;
};

export type Task = {
  assignees: Assignee[];
  description: string;
  dueDate: string;
  id: string;
  priority: Priority;
  subtasks: Subtask[];
  tags: string[];
  title: string;
};

export type BoardColumn = {
  id: string;
  title: string;
};

export const boardColumns: BoardColumn[] = [
  { id: "backlog", title: "Backlog" },
  { id: "to-do", title: "To do" },
  { id: "in-progress", title: "In progress" },
  { id: "review", title: "Review" },
  { id: "done", title: "Done" },
];

export const initialTasks: Record<string, Task[]> = {
  backlog: [
    {
      id: "task-1",
      title: "Explore launch day partnerships",
      description: "Identify three thoughtful partners who can add genuine value to the launch story.",
      priority: "Low",
      dueDate: "Oct 28",
      tags: ["Research", "Growth"],
      assignees: [{ name: "Sam Kim", initials: "SK" }],
      subtasks: [
        { title: "Create partner shortlist", done: false },
        { title: "Draft outreach note", done: false },
      ],
    },
    {
      id: "task-2",
      title: "Document launch success metrics",
      description: "Agree on a concise set of signals the team can review after launch.",
      priority: "Medium",
      dueDate: "Oct 25",
      tags: ["Strategy"],
      assignees: [{ name: "Jamie Tan", initials: "JT" }],
      subtasks: [{ title: "Align with analytics", done: false }],
    },
  ],
  "to-do": [
    {
      id: "task-3",
      title: "Write the launch narrative",
      description: "Turn the product positioning into a clear story for customers, press, and partners.",
      priority: "High",
      dueDate: "Today",
      tags: ["Copy", "Launch"],
      assignees: [
        { name: "Alex Morgan", initials: "AM" },
        { name: "Jamie Tan", initials: "JT" },
      ],
      subtasks: [
        { title: "Draft opening", done: true },
        { title: "Add customer proof", done: false },
        { title: "Review final CTA", done: false },
      ],
    },
    {
      id: "task-4",
      title: "Prepare the press kit",
      description: "Collect approved assets and concise background material for launch coverage.",
      priority: "Medium",
      dueDate: "Tomorrow",
      tags: ["Press"],
      assignees: [{ name: "Sam Kim", initials: "SK" }],
      subtasks: [
        { title: "Export product images", done: true },
        { title: "Finalize company boilerplate", done: false },
      ],
    },
    {
      id: "task-5",
      title: "Schedule customer preview",
      description: "Invite a small group of customers to a guided preview before launch day.",
      priority: "Low",
      dueDate: "Oct 24",
      tags: ["Customer"],
      assignees: [{ name: "Nina Park", initials: "NP" }],
      subtasks: [{ title: "Confirm invite list", done: false }],
    },
  ],
  "in-progress": [
    {
      id: "task-6",
      title: "Refine the product page",
      description: "Polish the final content hierarchy, responsive details, and primary conversion path.",
      priority: "High",
      dueDate: "Today",
      tags: ["Design", "Web"],
      assignees: [
        { name: "Alex Morgan", initials: "AM" },
        { name: "Nina Park", initials: "NP" },
      ],
      subtasks: [
        { title: "Finish responsive review", done: true },
        { title: "Tune motion timing", done: true },
        { title: "Complete accessibility pass", done: false },
      ],
    },
    {
      id: "task-7",
      title: "Record product walkthrough",
      description: "Create a concise walkthrough that demonstrates the essential launch workflow.",
      priority: "Medium",
      dueDate: "Oct 23",
      tags: ["Video"],
      assignees: [{ name: "Jamie Tan", initials: "JT" }],
      subtasks: [
        { title: "Approve storyboard", done: true },
        { title: "Record final take", done: false },
      ],
    },
  ],
  review: [
    {
      id: "task-8",
      title: "Review campaign creative",
      description: "Check the complete campaign family for consistency, clarity, and launch readiness.",
      priority: "High",
      dueDate: "Today",
      tags: ["Creative", "Review"],
      assignees: [
        { name: "Sam Kim", initials: "SK" },
        { name: "Alex Morgan", initials: "AM" },
      ],
      subtasks: [
        { title: "Review paid social", done: true },
        { title: "Review email sequence", done: false },
      ],
    },
    {
      id: "task-9",
      title: "Approve launch email sequence",
      description: "Read the full sequence as one customer journey and resolve the final comments.",
      priority: "Medium",
      dueDate: "Tomorrow",
      tags: ["Email"],
      assignees: [{ name: "Nina Park", initials: "NP" }],
      subtasks: [{ title: "Legal review", done: true }],
    },
  ],
  done: [
    {
      id: "task-10",
      title: "Approve the visual direction",
      description: "Confirm the final launch system across type, imagery, motion, and layout.",
      priority: "Medium",
      dueDate: "Completed",
      tags: ["Design"],
      assignees: [{ name: "Alex Morgan", initials: "AM" }],
      subtasks: [
        { title: "Review final system", done: true },
        { title: "Share with team", done: true },
      ],
    },
    {
      id: "task-11",
      title: "Set launch milestones",
      description: "Publish the shared sequence of decision points from final QA through launch day.",
      priority: "Low",
      dueDate: "Completed",
      tags: ["Planning"],
      assignees: [{ name: "Jamie Tan", initials: "JT" }],
      subtasks: [{ title: "Publish timeline", done: true }],
    },
  ],
};
