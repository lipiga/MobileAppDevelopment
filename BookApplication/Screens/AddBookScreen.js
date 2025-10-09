import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';

export default function AddBookScreen({ navigation }) {
  const [isbn, setIsbn] = useState('');
  const [name, setName] = useState('');

  const handleAddBook = async () => {
    if (!isbn.trim() || !name.trim()) {
      Toast.show({ 
        type: 'error', 
        text1: 'Validation Error', 
        text2: 'Please enter both ISBN and Book Name' 
      });
      return;
    }

    try {
      const res = await axios.post('http://192.168.1.6:4000/api/book/addbook', { isbn, name });
      if (res.data.success) {
        Toast.show({ 
          type: 'success', 
          text1: 'Success!', 
          text2: res.data.message 
        });
        setIsbn('');
        setName('');
      } else {
        Toast.show({ 
          type: 'error', 
          text1: 'Error', 
          text2: res.data.message 
        });
      }
    } catch (err) {
      Toast.show({ 
        type: 'error', 
        text1: 'Network Error', 
        text2: err.message 
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#4a7c59" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add New Book</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Book ISBN</Text>
            <TextInput
              style={styles.input}
              value={isbn}
              onChangeText={setIsbn}
              placeholder="Enter 13-digit ISBN"
              placeholderTextColor="#B0DB9C"
              keyboardType="numeric"
              maxLength={13}
            />

            <Text style={styles.label}>Book Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter book title"
              placeholderTextColor="#B0DB9C"
            />

            <TouchableOpacity style={styles.addButton} onPress={handleAddBook}>
              <Text style={styles.buttonText}>Add Book</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.viewAllButton} 
              onPress={() => navigation.navigate('listbook')}
            >
              <Text style={styles.viewAllText}>View All Books</Text>
              <Ionicons name="book-outline" size={20} color="#4a7c59" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECFAE5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#DDF6D2',
    paddingBottom: 15,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4a7c59',
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a7c59',
    marginBottom: 8,
    marginLeft: 5,
  },
  input: {
    backgroundColor: '#F9FDF7',
    borderWidth: 1,
    borderColor: '#DDF6D2',
    padding: 15,
    marginBottom: 20,
    borderRadius: 12,
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#B0DB9C',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#B0DB9C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginTop: 15,
  },
  viewAllText: {
    color: '#4a7c59',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});
