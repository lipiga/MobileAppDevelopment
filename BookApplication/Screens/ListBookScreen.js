import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, SafeAreaView } from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

export default function ListBookScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBooks = async () => {
    setRefreshing(true);
    try {
      const res = await axios.get('http://192.168.1.6:4000/api/book/listbook');
      const sortedData = res.data.data.sort((a, b) => a.isbn.localeCompare(b.isbn));
      setBooks(sortedData);
    } catch (err) {
      Toast.show({ 
        type: 'error', 
        text1: 'Failed to load books', 
        text2: err.message 
      });
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchBooks);
    return unsubscribe;
  }, [navigation]);

  const renderBookItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemContainer}
      onPress={() => navigation.navigate('BookDetails', { book: item })}
    >
      <View style={styles.bookIcon}>
        <Ionicons name="book" size={24} color="#4a7c59" />
      </View>
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={1} ellipsizeMode="tail">
          {item.name}
        </Text>
        <Text style={styles.bookIsbn}>ISBN: {item.isbn}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#B0DB9C" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Library</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('addbook')}
        >
          <MaterialIcons name="add" size={28} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={books}
        keyExtractor={(item) => item.isbn}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing}
            onRefresh={fetchBooks}
            colors={['#4a7c59']}
            tintColor="#4a7c59"
          />
        }
        renderItem={renderBookItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={60} color="#CAE8BD" />
            <Text style={styles.emptyTitle}>Your library is empty</Text>
            <Text style={styles.emptyText}>Add your first book to get started</Text>
            <TouchableOpacity 
              style={styles.addFirstButton}
              onPress={() => navigation.navigate('addbook')}
            >
              <Text style={styles.addFirstButtonText}>Add Book</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECFAE5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 70,
    paddingBottom: 10,
    backgroundColor: '#ECFAE5',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4a7c59',
  },
  addButton: {
    backgroundColor: '#4a7c59',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  bookIcon: {
    backgroundColor: '#DDF6D2',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  bookIsbn: {
    fontSize: 14,
    color: '#777',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4a7c59',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginBottom: 25,
  },
  addFirstButton: {
    backgroundColor: '#B0DB9C',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  addFirstButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
