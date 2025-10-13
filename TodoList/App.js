import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
  Alert,
  StatusBar,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);

  const handleAddTask = () => {
    if (task.trim() === '') {
      Alert.alert('Error', 'Please enter a task');
      return;
    }

    if (editIndex !== -1) {
      // Editing existing task - replace with new text (reset completion)
      const updatedTasks = [...tasks];
      updatedTasks[editIndex] = task.trim();
      setTasks(updatedTasks);
      setEditIndex(-1);
    } else {
      // Adding new task
      setTasks([...tasks, task.trim()]);
    }
    
    setTask('');
    Keyboard.dismiss();
  };

  const handleEditTask = (index) => {
    const item = tasks[index];
    // If item is an object (completed), load its text; otherwise it's a string
    setTask(typeof item === 'string' ? item : item.text);
    setEditIndex(index);
  };

  const handleDeleteTask = (index) => {
    const confirmMessage = 'Are you sure you want to delete this task?';

    if (Platform.OS === 'web') {
      // window.confirm works reliably on web
      if (window.confirm(confirmMessage)) {
        const updatedTasks = tasks.filter((_, taskIndex) => taskIndex !== index);
        setTasks(updatedTasks);
        if (editIndex === index) {
          setEditIndex(-1);
          setTask('');
        } else if (editIndex > index) {
          // adjust editIndex if an earlier item was removed
          setEditIndex(editIndex - 1);
        }
      }
    } else {
      // Native alert with buttons
      Alert.alert(
        'Delete Task',
        confirmMessage,
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              const updatedTasks = tasks.filter((_, taskIndex) => taskIndex !== index);
              setTasks(updatedTasks);
              if (editIndex === index) {
                setEditIndex(-1);
                setTask('');
              } else if (editIndex > index) {
                // adjust editIndex if an earlier item was removed
                setEditIndex(editIndex - 1);
              }
            }
          }
        ]
      );
    }
  };

  const handleToggleComplete = (index) => {
    const updatedTasks = [...tasks];
    const currentTask = updatedTasks[index];
    
    // Toggle completion status
    if (typeof currentTask === 'string') {
      // Mark as completed
      updatedTasks[index] = {
        text: currentTask,
        completed: true,
        completedAt: new Date().toLocaleString()
      };
    } else {
      // Toggle back to incomplete (store as string)
      updatedTasks[index] = currentTask.text;
    }
    
    setTasks(updatedTasks);
  };

  const renderTask = ({ item, index }) => {
    const isCompleted = typeof item !== 'string' && item.completed;
    const taskText = typeof item === 'string' ? item : item.text;
    const completedAt = typeof item !== 'string' ? item.completedAt : null;

    return (
      <View style={[styles.taskItem, isCompleted && styles.completedTask]}>
        <TouchableOpacity
          style={styles.taskContent}
          onPress={() => handleToggleComplete(index)}
        >
          <View style={[styles.checkbox, isCompleted && { backgroundColor: '#2196F3' }]}>
            {isCompleted && <Ionicons name="checkmark" size={16} color="#fff" />}
          </View>
          <View style={styles.taskTextContainer}>
            <Text style={[styles.taskText, isCompleted && styles.completedTaskText]}>
              {taskText}
            </Text>
            {isCompleted && completedAt && (
              <Text style={styles.completedDate}>
                Completed: {completedAt}
              </Text>
            )}
          </View>
        </TouchableOpacity>
        
        <View style={styles.taskActions}>
          <TouchableOpacity
            onPress={() => handleEditTask(index)}
            style={styles.actionButton}
          >
            <Ionicons name="create-outline" size={20} color="#4CAF50" />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => handleDeleteTask(index)}
            style={styles.actionButton}
          >
            <Ionicons name="trash-outline" size={20} color="#f44336" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Todo List</Text>
        <Text style={styles.taskCount}>
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter a new task..."
          value={task}
          onChangeText={setTask}
          onSubmitEditing={handleAddTask}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddTask}
        >
          <Ionicons 
            name={editIndex !== -1 ? "checkmark" : "add"} 
            size={24} 
            color="#fff" 
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(_, index) => index.toString()}
        style={styles.taskList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-done-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>No tasks yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Add a task above to get started!
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  taskCount: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: -10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 10,
    backgroundColor: '#f9f9f9',
  },
  addButton: {
    backgroundColor: '#2196F3',
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2196F3',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  taskList: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  completedTask: {
    backgroundColor: '#f0f0f0',
    opacity: 0.8,
  },
  taskContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#2196F3',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  taskTextContainer: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    color: '#333',
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  completedDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 5,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#888',
    marginTop: 16,
    fontWeight: '600',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 8,
    textAlign: 'center',
  },
});
