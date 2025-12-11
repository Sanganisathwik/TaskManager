// src/services/taskService.ts
import api from './api';
import { Task } from '../types/Task';

export async function fetchTasks(): Promise<Task[]> {
  const { data } = await api.get<Task[]>('/tasks');
  return data;
}

export type CreateTaskInput = Omit<Task, 'id' | 'isCompleted'> & { isCompleted?: boolean };

export async function createTask(task: CreateTaskInput): Promise<Task> {
  const { data } = await api.post<Task>('/tasks', task);
  return data;
}

export async function updateTaskStatus(id: string, isCompleted: boolean): Promise<Task> {
  const { data } = await api.put<Task>(`/tasks/${id}`, { isCompleted });
  return data;
}

export async function deleteTask(id: string): Promise<{ success: boolean }>{
  const { data } = await api.delete<{ success: boolean }>(`/tasks/${id}`);
  return data;
}
