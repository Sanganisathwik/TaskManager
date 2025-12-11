// src/store/taskStore.ts
import { create } from 'zustand';
import { Task, Priority } from '../types/Task';
import { fetchTasks, createTask, updateTaskStatus, deleteTask, CreateTaskInput } from '../services/taskService';

export type TaskFilter = 'ALL' | 'COMPLETED' | 'PENDING' | 'HIGH_PRIORITY';
export type TaskSort = 'DEADLINE_ASC' | 'PRIORITY_DESC' | 'COMBINED_SCORE';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  filter: TaskFilter;
  sort: TaskSort;
  load: () => Promise<void>;
  add: (t: CreateTaskInput) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
  setFilter: (f: TaskFilter) => void;
  setSort: (s: TaskSort) => void;
}

// Combined score algorithm:
// score = basePriority + urgency
// where basePriority: Low=1, Medium=2, High=3
// urgency = 0..3 bucket based on hours-to-deadline (<=24h -> 3, <=72h -> 2, else -> 1, missing -> 0)
function combinedScore(task: Task): number {
  const basePriority = task.priority === 'High' ? 3 : task.priority === 'Medium' ? 2 : 1;
  let urgency = 0;
  if (task.deadline) {
    const deadlineMs = Date.parse(task.deadline);
    const hoursLeft = (deadlineMs - Date.now()) / (1000 * 60 * 60);
    if (hoursLeft <= 24) urgency = 3; else if (hoursLeft <= 72) urgency = 2; else urgency = 1;
  }
  return basePriority + urgency;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,
  filter: 'ALL',
  sort: 'DEADLINE_ASC',

  async load() {
    set({ loading: true });
    try {
      const list = await fetchTasks();
      set({ tasks: list });
    } finally {
      set({ loading: false });
    }
  },

  async add(t) {
    set({ loading: true });
    try {
      const created = await createTask({ ...t, isCompleted: t.isCompleted ?? false });
      set({ tasks: [created, ...get().tasks] });
    } finally {
      set({ loading: false });
    }
  },

  async toggleComplete(id) {
    const current = get().tasks.find(x => x.id === id);
    if (!current) return;
    set({ loading: true });
    try {
      const updated = await updateTaskStatus(id, !current.isCompleted);
      set({ tasks: get().tasks.map(t => (t.id === id ? updated : t)) });
    } finally {
      set({ loading: false });
    }
  },

  async remove(id) {
    set({ loading: true });
    try {
      await deleteTask(id);
      set({ tasks: get().tasks.filter(t => t.id !== id) });
    } finally {
      set({ loading: false });
    }
  },

  setFilter(f) { set({ filter: f }); },
  setSort(s) { set({ sort: s }); },
}));

export function selectVisibleTasks(tasks: Task[], filter: TaskFilter, sort: TaskSort): Task[] {
  let filtered = tasks;
  if (filter === 'COMPLETED') filtered = tasks.filter(t => t.isCompleted);
  else if (filter === 'PENDING') filtered = tasks.filter(t => !t.isCompleted);
  else if (filter === 'HIGH_PRIORITY') filtered = tasks.filter(t => t.priority === 'High');

  if (sort === 'DEADLINE_ASC') {
    return filtered.slice().sort((a, b) => (Date.parse(a.deadline || '9999-12-31') - Date.parse(b.deadline || '9999-12-31')));
  } else if (sort === 'PRIORITY_DESC') {
    const rank = (p: Priority) => (p === 'High' ? 3 : p === 'Medium' ? 2 : 1);
    return filtered.slice().sort((a, b) => rank(b.priority) - rank(a.priority));
  } else {
    return filtered.slice().sort((a, b) => combinedScore(b) - combinedScore(a));
  }
}
