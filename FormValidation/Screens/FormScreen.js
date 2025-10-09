import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {
  KeyboardAvoidingView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FormScreen = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    course: '',
    rating: 0
  });
  const [errors, setErrors] = useState({});
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);

  const courses = [
    'UI/UX Design',
    'Graphic Design',
    'Java Full Stack',
    'MERN Stack',
    'Flutter App Development',
    'Machine Learning',
    'Artificial Intelligence'
  ];

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      valid = false;
    }

    if (!formData.course) {
      newErrors.course = 'Please select a course';
      valid = false;
    }

    if (formData.rating === 0) {
      newErrors.rating = 'Please rate your experience';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Show success toast
      Toast.show({
        type: 'success',
        text1: 'Feedback Submitted',
        text2: 'Thank you for your valuable feedback!',
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 50
      });

      // Here you would typically send the data to your backend
      console.log('Form submitted:', formData);

      // Reset form after submission
      setFormData({
        name: '',
        email: '',
        course: '',
        rating: 0
      });
    }
  };

  const handleClear = () => {
    setFormData({
      name: '',
      email: '',
      course: '',
      rating: 0
    });
    setErrors({});
  };

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const renderRatingStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => handleInputChange('rating', i)}
          style={styles.star}
        >
          <Ionicons
            name={i <= formData.rating ? "star" : "star-outline"}
            size={32}
            color={i <= formData.rating ? "#D9A299" : "#DCC5B2"}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.innerContainer}>
          {/* ... [rest of your form UI remains the same] ... */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="chatbox-ellipses" size={32} color="#D9A299" />
            </View>
            <Text style={styles.title}>E-Learn Feedback Form</Text>
            <Text style={styles.subtitle}>We value your learning experience</Text>
          </View>

          {/* Name Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Your Name</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
              placeholder="Enter your name"
              placeholderTextColor="#DCC5B2"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          {/* Email Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              placeholder="your@email.com"
              placeholderTextColor="#DCC5B2"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          {/* Course Dropdown */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Course</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowCourseDropdown(true)}
            >
              <Text style={formData.course ? styles.dropdownTextSelected : styles.dropdownText}>
                {formData.course || 'Select a course'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#D9A299" />
            </TouchableOpacity>
            {errors.course && <Text style={styles.errorText}>{errors.course}</Text>}
          </View>

          {/* Rating */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Rate Your Learning Experience</Text>
            <View style={styles.ratingContainer}>
              {renderRatingStars()}
            </View>
            <View style={styles.ratingLabels}>
              <Text style={styles.ratingLabel}>Poor</Text>
              <Text style={styles.ratingLabel}>Excellent</Text>
            </View>
            {errors.rating && <Text style={styles.errorText}>{errors.rating}</Text>}
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.clearButton]}
              onPress={handleClear}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText} numberOfLines={1}>
                Submit
              </Text>
              <Ionicons name="send" size={18} color="#FAF7F3" style={styles.submitIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showCourseDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCourseDropdown(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowCourseDropdown(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {courses.map((course) => (
                <TouchableOpacity
                  key={course}
                  style={styles.courseItem}
                  onPress={() => {
                    handleInputChange('course', course);
                    setShowCourseDropdown(false);
                  }}
                >
                  <Text style={styles.courseText}>{course}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F3',
    paddingTop: 40,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  innerContainer: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconContainer: {
    backgroundColor: '#F0E4D3',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#D9A299',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#DCC5B2',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#D9A299',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#F0E4D3',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#8A6D5B',
  },
  dropdown: {
    backgroundColor: '#F0E4D3',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#DCC5B2',
  },
  dropdownTextSelected: {
    fontSize: 16,
    color: '#8A6D5B',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  star: {
    padding: 5,
  },
  ratingLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingLabel: {
    fontSize: 12,
    color: '#DCC5B2',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
    marginHorizontal: 5,
  },
  clearButton: {
    backgroundColor: '#F0E4D3',
    borderWidth: 1,
    borderColor: '#D9A299',
  },
  clearButtonText: {
    color: '#D9A299',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#D9A299',
  },
  submitButtonText: {
    color: '#FAF7F3',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
    flexShrink: 1, // Add this to prevent text wrapping
  },
  submitIcon: {
    marginLeft: 5, // Add some spacing between text and icon
  },
  errorText: {
    color: '#D9A299',
    fontSize: 12,
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FAF7F3',
    borderRadius: 12,
    padding: 15,
    maxHeight: '60%',
  },
  courseItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E4D3',
  },
  courseText: {
    fontSize: 16,
    color: '#8A6D5B',
  },
});

export default FormScreen;
