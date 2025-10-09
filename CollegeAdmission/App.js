import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import Animated, {
  FadeInUp,
  FadeIn,
  SlideInLeft,
  SlideInRight,
  useAnimatedStyle,
  withSpring,
  withTiming
} from 'react-native-reanimated';

// Create Tab Navigator
const Tab = createBottomTabNavigator();

// Minimal Color constants
const COLORS = {
  primary: '#59AC77',
  primaryDark: '#3A6F43',
  primaryLight: '#7BC396',
  background: '#ffffff',
  card: '#f8faf9',
  text: '#1a3c2e',
  textLight: '#5a7a6a',
  error: '#e53e3e',
  success: '#38a169',
  border: '#e2e8e5'
};

// Home Screen Component
function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.screenContainer}>
      <View style={styles.contentContainer}>
        <Animated.View entering={FadeInUp.duration(600)} style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>College Admission</Text>
          <Text style={styles.welcomeSubtitle}>Begin your academic journey</Text>
        </Animated.View>
        
        <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="school" size={24} color={COLORS.primary} />
            <Text style={styles.cardTitle}>Start Application</Text>
          </View>
          <Text style={styles.cardText}>
            Complete your admission form and upload required documents to begin.
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Admission Form')}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(400)} style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="document-text" size={24} color={COLORS.primary} />
            <Text style={styles.cardTitle}>Required Documents</Text>
          </View>
          <View style={styles.documentsList}>
            <Text style={styles.documentItem}>• Academic transcripts</Text>
            <Text style={styles.documentItem}>• Identification document</Text>
            <Text style={styles.documentItem}>• Recommendation letters</Text>
            <Text style={styles.documentItem}>• Personal statement</Text>
          </View>
        </Animated.View>
      </View>
    </ScrollView>
  );
}

// Admission Form Screen Component
function AdmissionFormScreen({ navigation }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    course: '',
    dob: '',
  });
 
  const [errors, setErrors] = useState({});
  const [showCourseOptions, setShowCourseOptions] = useState(false);
 
  const validateForm = () => {
    let valid = true;
    const newErrors = {};
   
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      valid = false;
    }
   
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      valid = false;
    }
   
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }
   
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      valid = false;
    }
   
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
      valid = false;
    }
   
    if (!formData.course) {
      newErrors.course = 'Course selection is required';
      valid = false;
    }
   
    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
      valid = false;
    }
   
    setErrors(newErrors);
    return valid;
  };
 
  const handleSubmit = () => {
    if (validateForm()) {
      Alert.alert(
        'Application Submitted',
        'Your application has been submitted successfully! Please upload your documents.',
        [
          {
            text: 'Continue',
            onPress: () => navigation.navigate('Upload Documents')
          }
        ]
      );
    }
  };
 
  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
   
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
 
  const courses = ['Computer Science', 'Business Administration', 'Engineering', 'Medicine', 'Arts', 'Law'];
 
  return (
    <ScrollView style={styles.screenContainer}>
      <View style={styles.contentContainer}>
        <Animated.View entering={SlideInLeft.duration(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>Admission Form</Text>
          <Text style={styles.sectionSubtitle}>Please complete all fields</Text>
        </Animated.View>
        
        <Animated.View entering={SlideInLeft.duration(500).delay(200)} style={styles.form}>
          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, styles.halfInput]}>
              <Text style={styles.label}>First Name *</Text>
              <TextInput
                style={[styles.input, errors.firstName && styles.inputError]}
                value={formData.firstName}
                onChangeText={(text) => handleChange('firstName', text)}
                placeholder="First name"
                placeholderTextColor={COLORS.textLight}
              />
              {errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null}
            </View>
           
            <View style={[styles.inputGroup, styles.halfInput]}>
              <Text style={styles.label}>Last Name *</Text>
              <TextInput
                style={[styles.input, errors.lastName && styles.inputError]}
                value={formData.lastName}
                onChangeText={(text) => handleChange('lastName', text)}
                placeholder="Last name"
                placeholderTextColor={COLORS.textLight}
              />
              {errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              placeholder="email@example.com"
              placeholderTextColor={COLORS.textLight}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
          </View>
         
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone *</Text>
            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              value={formData.phone}
              onChangeText={(text) => handleChange('phone', text)}
              placeholder="Phone number"
              placeholderTextColor={COLORS.textLight}
              keyboardType="phone-pad"
            />
            {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
          </View>
         
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address *</Text>
            <TextInput
              style={[styles.input, errors.address && styles.inputError, styles.textArea]}
              value={formData.address}
              onChangeText={(text) => handleChange('address', text)}
              placeholder="Your complete address"
              placeholderTextColor={COLORS.textLight}
              multiline
              numberOfLines={3}
            />
            {errors.address ? <Text style={styles.errorText}>{errors.address}</Text> : null}
          </View>
         
          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, styles.halfInput]}>
              <Text style={styles.label}>Date of Birth *</Text>
              <TextInput
                style={[styles.input, errors.dob && styles.inputError]}
                value={formData.dob}
                onChangeText={(text) => handleChange('dob', text)}
                placeholder="DD/MM/YYYY"
                placeholderTextColor={COLORS.textLight}
              />
              {errors.dob ? <Text style={styles.errorText}>{errors.dob}</Text> : null}
            </View>
           
            <View style={[styles.inputGroup, styles.halfInput]}>
              <Text style={styles.label}>Course *</Text>
              <TouchableOpacity
                style={[styles.input, errors.course && styles.inputError, styles.courseSelector]}
                onPress={() => setShowCourseOptions(!showCourseOptions)}
              >
                <Text style={formData.course ? {color: COLORS.text} : {color: COLORS.textLight}}>
                  {formData.course || 'Select course'}
                </Text>
                <Ionicons
                  name={showCourseOptions ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={COLORS.textLight}
                />
              </TouchableOpacity>
              {errors.course ? <Text style={styles.errorText}>{errors.course}</Text> : null}
            </View>
          </View>
         
          {showCourseOptions && (
            <Animated.View entering={FadeIn.duration(300)} style={styles.courseOptions}>
              {courses.map((course) => (
                <TouchableOpacity
                  key={course}
                  style={styles.courseOption}
                  onPress={() => {
                    handleChange('course', course);
                    setShowCourseOptions(false);
                  }}
                >
                  <Text style={styles.courseOptionText}>{course}</Text>
                </TouchableOpacity>
              ))}
            </Animated.View>
          )}
         
          <Animated.View entering={FadeIn.duration(500).delay(800)}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
              <Text style={styles.primaryButtonText}>Submit Application</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>
    </ScrollView>
  );
}

// Document Upload Screen Component
function DocumentUploadScreen({ navigation }) {
  const [documents, setDocuments] = useState([]);
 
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });
     
      if (result.canceled === false && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setDocuments([...documents, {
          name: file.name,
          uri: file.uri,
          type: file.mimeType,
          size: file.size
        }]);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };
 
  const removeDocument = (index) => {
    const updatedDocs = [...documents];
    updatedDocs.splice(index, 1);
    setDocuments(updatedDocs);
  };

  const handleSubmitDocuments = () => {
    if (documents.length === 0) {
      Alert.alert('No Documents', 'Please upload at least one document.');
      return;
    }
   
    Alert.alert(
      'Documents Submitted',
      `Your ${documents.length} document(s) have been submitted.`,
      [
        {
          text: 'View Status',
          onPress: () => navigation.navigate('Status', { fromDocuments: true })
        }
      ]
    );
  };
 
  return (
    <View style={styles.screenContainer}>
      <ScrollView style={styles.contentContainer}>
        <Animated.View entering={SlideInRight.duration(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>Upload Documents</Text>
          <Text style={styles.sectionSubtitle}>Required for application processing</Text>
        </Animated.View>
        
        <Animated.View entering={SlideInRight.duration(500).delay(200)} style={styles.uploadSection}>
          <TouchableOpacity style={styles.uploadArea} onPress={pickDocument}>
            <Ionicons name="cloud-upload" size={32} color={COLORS.primary} />
            <Text style={styles.uploadAreaText}>Select Files</Text>
            <Text style={styles.uploadHint}>PDF, DOC, JPG, PNG up to 10MB</Text>
          </TouchableOpacity>
         
          <View style={styles.documentsSection}>
            <Text style={styles.sectionLabel}>Uploaded Documents ({documents.length})</Text>
            {documents.map((doc, index) => (
              <Animated.View
                key={index}
                style={styles.documentCard}
                entering={FadeInUp.duration(400).delay(index * 100)}
              >
                <View style={styles.documentInfo}>
                  <Ionicons name="document" size={20} color={COLORS.primary} />
                  <View style={styles.documentDetails}>
                    <Text style={styles.documentName} numberOfLines={1}>{doc.name}</Text>
                    <Text style={styles.documentSize}>
                      {doc.size ? Math.round(doc.size / 1024) + ' KB' : 'Size unknown'}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => removeDocument(index)}>
                  <Ionicons name="close" size={20} color={COLORS.textLight} />
                </TouchableOpacity>
              </Animated.View>
            ))}
           
            {documents.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="folder-open" size={40} color={COLORS.textLight} />
                <Text style={styles.emptyStateText}>No documents uploaded</Text>
              </View>
            )}
          </View>
         
          {documents.length > 0 && (
            <TouchableOpacity style={styles.primaryButton} onPress={handleSubmitDocuments}>
              <Text style={styles.primaryButtonText}>Submit Documents</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// Status Screen Component
function StatusScreen({ route }) {
  const [status, setStatus] = useState('Under Review');
  const [applicationProgress, setApplicationProgress] = useState({
    formSubmitted: true,
    documentsSubmitted: false,
    underReview: false,
    decisionMade: false
  });

  useEffect(() => {
    if (route.params?.fromDocuments) {
      setApplicationProgress(prev => ({
        ...prev,
        documentsSubmitted: true,
        underReview: true
      }));
      setStatus('Under Review');
    }
  }, [route.params]);

  const statusSteps = [
    { key: 'formSubmitted', title: 'Application Submitted', completed: applicationProgress.formSubmitted },
    { key: 'documentsSubmitted', title: 'Documents Uploaded', completed: applicationProgress.documentsSubmitted },
    { key: 'underReview', title: 'Under Review', completed: applicationProgress.underReview },
    { key: 'decisionMade', title: 'Decision Made', completed: applicationProgress.decisionMade }
  ];

  return (
    <ScrollView style={styles.screenContainer}>
      <View style={styles.contentContainer}>
        <Animated.View entering={FadeInUp.duration(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>Application Status</Text>
          <Text style={styles.sectionSubtitle}>Track your admission progress</Text>
        </Animated.View>
        
        <Animated.View entering={FadeInUp.duration(500).delay(200)} style={styles.statusSection}>
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <Text style={styles.statusLabel}>Current Status</Text>
              <View style={[styles.statusBadge, 
                status === 'Under Review' && styles.statusReview,
                status === 'Accepted' && styles.statusAccepted
              ]}>
                <Text style={styles.statusBadgeText}>{status}</Text>
              </View>
            </View>
           
            <View style={styles.progressContainer}>
              {statusSteps.map((step, index) => (
                <View key={step.key} style={styles.progressStep}>
                  <View style={[
                    styles.stepIndicator,
                    step.completed ? styles.stepCompleted : styles.stepPending
                  ]}>
                    {step.completed && <Ionicons name="checkmark" size={14} color="#fff" />}
                  </View>
                  <Text style={[
                    styles.stepTitle,
                    step.completed ? styles.stepTitleCompleted : styles.stepTitlePending
                  ]}>
                    {step.title}
                  </Text>
                  {index < statusSteps.length - 1 && (
                    <View style={[
                      styles.stepConnector,
                      step.completed ? styles.connectorCompleted : styles.connectorPending
                    ]} />
                  )}
                </View>
              ))}
            </View>
          </View>
         
          <View style={styles.helpCard}>
            <Text style={styles.helpTitle}>Need Assistance?</Text>
            <Text style={styles.helpText}>
              Contact our admissions office for any questions about your application.
            </Text>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Contact Support</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </ScrollView>
  );
}

// Custom Tab Bar Component
function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };
       
        let iconName;
        if (route.name === 'Home') {
          iconName = isFocused ? 'home' : 'home-outline';
        } else if (route.name === 'Admission Form') {
          iconName = isFocused ? 'document-text' : 'document-text-outline';
        } else if (route.name === 'Upload Documents') {
          iconName = isFocused ? 'cloud-upload' : 'cloud-upload-outline';
        } else if (route.name === 'Status') {
          iconName = isFocused ? 'time' : 'time-outline';
        }

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
          >
            <View style={[styles.tabIcon, isFocused && styles.tabIconActive]}>
              <Ionicons 
                name={iconName} 
                size={20} 
                color={isFocused ? COLORS.primary : COLORS.textLight} 
              />
            </View>
            <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// Main App Component
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={props => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
        />
        <Tab.Screen
          name="Admission Form"
          component={AdmissionFormScreen}
        />
        <Tab.Screen
          name="Upload Documents"
          component={DocumentUploadScreen}
        />
        <Tab.Screen
          name="Status"
          component={StatusScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// Minimal Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop:30,
    
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 10,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '300',
    color: COLORS.text,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '300',
    color: COLORS.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 16,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.text,
    marginLeft: 12,
  },
  cardText: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
    marginBottom: 20,
  },
  documentsList: {
    marginLeft: 8,
  },
  documentItem: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 6,
  },
  form: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputGroup: {
    marginBottom: 20,
  },
  halfInput: {
    flex: 0.48,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  courseSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
  },
  courseOptions: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  courseOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  courseOptionText: {
    color: COLORS.text,
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginTop: 8,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontWeight: '500',
    fontSize: 16,
  },
  uploadSection: {
    marginBottom: 20,
  },
  uploadArea: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  uploadAreaText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.primary,
    marginTop: 12,
    marginBottom: 4,
  },
  uploadHint: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  documentsSection: {
    marginBottom: 24,
  },
  documentCard: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  documentDetails: {
    marginLeft: 12,
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 2,
  },
  documentSize: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    marginTop: 12,
    color: COLORS.textLight,
    fontSize: 14,
  },
  statusSection: {
    marginBottom: 20,
  },
  statusCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusBadgeText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 12,
  },
  statusReview: {
    backgroundColor: COLORS.primary,
  },
  statusAccepted: {
    backgroundColor: COLORS.success,
  },
  progressContainer: {
    marginLeft: 8,
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepCompleted: {
    backgroundColor: COLORS.primary,
  },
  stepPending: {
    backgroundColor: COLORS.border,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  stepTitle: {
    fontSize: 14,
    flex: 1,
  },
  stepTitleCompleted: {
    color: COLORS.text,
    fontWeight: '500',
  },
  stepTitlePending: {
    color: COLORS.textLight,
  },
  stepConnector: {
    position: 'absolute',
    left: 12,
    top: 24,
    bottom: -20,
    width: 2,
  },
  connectorCompleted: {
    backgroundColor: COLORS.primary,
  },
  connectorPending: {
    backgroundColor: COLORS.border,
  },
  helpCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
    marginBottom: 16,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    height: 130,
    paddingBottom: 50,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  tabIconActive: {
    backgroundColor: COLORS.card,
  },
  tabLabel: {
    fontSize: 10,
    color: COLORS.textLight,
    fontWeight: '400',
  },
  tabLabelActive: {
    color: COLORS.primary,
    fontWeight: '500',
  },
});
