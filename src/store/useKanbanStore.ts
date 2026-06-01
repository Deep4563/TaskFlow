import { create } from "zustand";

export interface CommentItem {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  content: string;
  createdAt: string;
}

// Plain interface — avoids Mongoose ObjectId type conflicts
export interface TaskItem {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: "low" | "medium" | "high";
  assignee?: any;
  project: any;
  createdBy?: any;
  dueDate?: Date;
  order: number;
  tags: string[];
  comments: CommentItem[];
  createdAt?: Date;
  updatedAt?: Date;
}



export type TaskStatus = "todo" | "in-progress" | "done";

export interface KanbanColumn {
  id: TaskStatus;
  title: string;
  tasks: TaskItem[];
}

interface KanbanState {
  columns: KanbanColumn[];
  isLoading: boolean;
  error: string | null;
  activeProjectId: string | null;

  // Actions
  setTasks: (tasks: TaskItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setActiveProject: (projectId: string) => void;
  addTask: (task: TaskItem) => void;
  updateTask: (taskId: string, updates: Partial<TaskItem>) => void;
  moveTask: (taskId: string, newStatus: TaskStatus, newOrder: number) => void;
  deleteTask: (taskId: string) => void;
}

const defaultColumns: KanbanColumn[] = [
  { id: "todo", title: "To Do", tasks: [] },
  { id: "in-progress", title: "In Progress", tasks: [] },
  { id: "done", title: "Done", tasks: [] },
];

export const useKanbanStore = create<KanbanState>((set) => ({
  columns: defaultColumns,
  isLoading: false,
  error: null,
  activeProjectId: null,

  setTasks: (tasks: TaskItem[]) => {
    set({
      columns: [
        {
          id: "todo",
          title: "To Do",
          tasks: tasks
            .filter((t) => t.status === "todo")
            .sort((a, b) => a.order - b.order),
        },
        {
          id: "in-progress",
          title: "In Progress",
          tasks: tasks
            .filter((t) => t.status === "in-progress")
            .sort((a, b) => a.order - b.order),
        },
        {
          id: "done",
          title: "Done",
          tasks: tasks
            .filter((t) => t.status === "done")
            .sort((a, b) => a.order - b.order),
        },
      ],
    });
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setActiveProject: (projectId) => set({ activeProjectId: projectId }),

  addTask: (task: TaskItem) =>
    set((state) => ({
      columns: state.columns.map((col) =>
        col.id === task.status
          ? { ...col, tasks: [...col.tasks, task] }
          : col
      ),
    })),

  updateTask: (taskId: string, updates: Partial<TaskItem>) =>
    set((state) => ({
      columns: state.columns.map((col) => ({
        ...col,
        tasks: col.tasks.map((task) =>
          task._id === taskId
            ? { ...task, ...updates }
            : task
        ),
      })),
    })),

  moveTask: (taskId: string, newStatus: TaskStatus, newOrder: number) =>
    set((state) => {
      let movedTask: TaskItem | null = null;

      const columnsWithoutTask = state.columns.map((col) => ({
        ...col,
        tasks: col.tasks.filter((task) => {
          if (task._id === taskId) {
            movedTask = task;
            return false;
          }
          return true;
        }),
      }));

      if (!movedTask) return state;

      return {
        columns: columnsWithoutTask.map((col) =>
          col.id === newStatus
            ? {
                ...col,
                tasks: [
                  ...col.tasks,
                  { ...movedTask!, status: newStatus, order: newOrder },
                ].sort((a, b) => a.order - b.order),
              }
            : col
        ),
      };
    }),

  deleteTask: (taskId: string) =>
    set((state) => ({
      columns: state.columns.map((col) => ({
        ...col,
        tasks: col.tasks.filter((task) => task._id !== taskId),
      })),
    })),
}));