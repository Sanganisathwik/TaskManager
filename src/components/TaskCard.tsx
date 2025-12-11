// src/components/TaskCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Task } from '../types/Task';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const priorityColor = (p: Task['priority']) => (
  p === 'High' ? '#FF3B30' : p === 'Medium' ? '#FF9500' : '#34C759'
);

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleComplete, onDelete }) => {
  return (
    <View style={[styles.card, task.isCompleted && styles.completed]}>
      <View style={styles.header}>
        <View style={[styles.priorityDot, { backgroundColor: priorityColor(task.priority) }]} />
        <Text style={styles.title}>{task.title}</Text>
      </View>
      {task.description ? <Text style={styles.desc}>{task.description}</Text> : null}
      <View style={styles.row}>
        {task.deadline ? <Text style={styles.meta}>Due: {new Date(task.deadline).toLocaleString()}</Text> : <Text style={styles.meta}>No deadline</Text>}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onToggleComplete(task.id)}>
          <Text style={[styles.actionBtn, { color: task.isCompleted ? '#34C759' : '#007AFF' }]}>
            {task.isCompleted ? 'Completed' : 'Mark Complete'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(task.id)}>
          <Text style={[styles.actionBtn, { color: '#FF3B30' }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '92%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  completed: { opacity: 0.6 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  priorityDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  title: { fontSize: 18, fontWeight: '700', color: '#222' },
  desc: { fontSize: 14, color: '#666', marginTop: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  meta: { fontSize: 12, color: '#888' },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  actionBtn: { fontSize: 14, fontWeight: '600' },
});

export default TaskCard;
