// src/hooks/useTaskFilters.ts
import { Task } from '../types/Task';
import { TaskFilter, TaskSort, selectVisibleTasks } from '../store/taskStore';

export function useTaskFilters(tasks: Task[], filter: TaskFilter, sort: TaskSort) {
  const visible = selectVisibleTasks(tasks, filter, sort);
  return { visible };
}
