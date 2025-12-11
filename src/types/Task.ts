// src/types/Task.ts
export type Priority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dateTime?: string; // ISO string for creation or scheduled time
  deadline?: string; // ISO string
  priority: Priority;
  isCompleted: boolean;
  owner?: string; // optional user id for multi-user backends
}
