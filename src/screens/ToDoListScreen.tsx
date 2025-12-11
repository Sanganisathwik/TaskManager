// src/screens/ToDoListScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

const ToDoListScreen = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error: any) {
      Alert.alert("Error", "Could not log out.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Task List (Protected)</Text>
      <Text style={styles.subtitle}>You are successfully logged in!</Text>
      <Button title="Logout" onPress={handleLogout} color="#FF3B30" />
      {/* We will build the Task List UI here later */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#eef' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  subtitle: { fontSize: 16, marginBottom: 30, color: '#666' }
});

export default ToDoListScreen;