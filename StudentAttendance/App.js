import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  SafeAreaView,
  StatusBar
} from 'react-native';

export default function App() {
  const [students, setStudents] = useState([
    { id: '1', name: 'John Doe', present: null },
    { id: '2', name: 'Jane Smith', present: null },
    { id: '3', name: 'Mike Johnson', present: null },
    { id: '4', name: 'Sarah Wilson', present: null },
    { id: '5', name: 'David Brown', present: null },
    { id: '6', name: 'Emily Davis', present: null },
    { id: '7', name: 'Chris Lee', present: null },
    { id: '8', name: 'Amanda Taylor', present: null },
  ]);

  const [showSaveModal, setShowSaveModal] = useState(false);

  const markAttendance = (studentId, isPresent) => {
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.id === studentId
          ? { ...student, present: isPresent }
          : student
      )
    );
  };

  const getAbsentCount = () => {
    return students.filter(student => student.present === false).length;
  };

  const getPresentCount = () => {
    return students.filter(student => student.present === true).length;
  };

  const saveAttendance = () => {
    const absentCount = getAbsentCount();
    const presentCount = getPresentCount();
    
    Alert.alert(
      'Attendance Saved',
      `Attendance has been saved successfully!\n\nPresent: ${presentCount}\nAbsent: ${absentCount}\nTotal: ${students.length}`,
      [
        {
          text: 'OK',
          onPress: () => console.log('Attendance saved'),
        },
      ]
    );
  };

  const resetAttendance = () => {
    setStudents(prevStudents =>
      prevStudents.map(student => ({ ...student, present: null }))
    );
  };

  const renderStudentItem = ({ item }) => (
    <View style={[
      styles.studentItem,
      item.present === true && styles.presentItem,
      item.present === false && styles.absentItem
    ]}>
      <Text style={styles.studentName}>{item.name}</Text>
      <View style={styles.attendanceButtons}>
        <TouchableOpacity
          style={[
            styles.attendanceButton,
            styles.presentButton,
            item.present === true && styles.selectedPresent
          ]}
          onPress={() => markAttendance(item.id, true)}
        >
          <Text style={styles.buttonText}>Present</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.attendanceButton,
            styles.absentButton,
            item.present === false && styles.selectedAbsent
          ]}
          onPress={() => markAttendance(item.id, false)}
        >
          <Text style={styles.buttonText}>Absent</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Student Attendance Tracker</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{getPresentCount()}</Text>
            <Text style={styles.statLabel}>Present</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{getAbsentCount()}</Text>
            <Text style={styles.statLabel}>Absent</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{students.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
      </View>

      {/* Student List */}
      <FlatList
        data={students}
        renderItem={renderStudentItem}
        keyExtractor={item => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.resetButton]}
          onPress={resetAttendance}
        >
          <Text style={styles.actionButtonText}>Reset All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.saveButton]}
          onPress={() => setShowSaveModal(true)}
        >
          <Text style={styles.actionButtonText}>Save Attendance</Text>
        </TouchableOpacity>
      </View>

      {/* Save Confirmation Modal */}
      <Modal
        visible={showSaveModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Save</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to save the attendance?
            </Text>
            <View style={styles.modalStats}>
              <Text style={styles.modalStat}>Present: {getPresentCount()}</Text>
              <Text style={styles.modalStat}>Absent: {getAbsentCount()}</Text>
              <Text style={styles.modalStat}>Total: {students.length}</Text>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowSaveModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={() => {
                  setShowSaveModal(false);
                  saveAttendance();
                }}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  list: {
    flex: 1,
    padding: 10,
  },
  studentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  presentItem: {
    backgroundColor: '#d4edda',
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  absentItem: {
    backgroundColor: '#f8d7da',
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  attendanceButtons: {
    flexDirection: 'row',
  },
  attendanceButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginLeft: 10,
    minWidth: 70,
    alignItems: 'center',
  },
  presentButton: {
    backgroundColor: '#e8f5e8',
    borderWidth: 1,
    borderColor: '#28a745',
  },
  absentButton: {
    backgroundColor: '#fde8e8',
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  selectedPresent: {
    backgroundColor: '#28a745',
  },
  selectedAbsent: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  resetButton: {
    backgroundColor: '#6c757d',
  },
  saveButton: {
    backgroundColor: '#007bff',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 15,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  modalStats: {
    marginBottom: 20,
    alignItems: 'center',
  },
  modalStat: {
    fontSize: 16,
    marginVertical: 2,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  confirmButton: {
    backgroundColor: '#007bff',
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
