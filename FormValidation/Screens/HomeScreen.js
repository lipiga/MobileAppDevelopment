import React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  KeyboardAvoidingView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.innerContainer}>
          {/* Header with welcome message */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="book" size={40} color="#D9A299" />
            </View>
            <Text style={styles.title}>Welcome to E-Learn</Text>
            <Text style={styles.subtitle}>Expand your knowledge with our courses</Text>
          </View>

          {/* App Introduction */}
          <View style={styles.introCard}>
            <Text style={styles.introTitle}>Your Learning Journey Starts Here</Text>
            <Text style={styles.introText}>
              E-Learn provides high-quality courses across various disciplines. 
              Learn at your own pace with our expert instructors and interactive content.
            </Text>
            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <Ionicons name="time-outline" size={24} color="#D9A299" />
                <Text style={styles.featureText}>Self-paced learn</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="ribbon-outline" size={24} color="#D9A299" />
                <Text style={styles.featureText}>Certified courses</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="people-outline" size={24} color="#D9A299" />
                <Text style={styles.featureText}>Expert instructors</Text>
              </View>
            </View>
          </View>

          {/* Feedback Prompt */}
          <View style={styles.feedbackCard}>
            <Ionicons name="chatbox-ellipses-outline" size={36} color="#FAF7F3" />
            <Text style={styles.feedbackTitle}>We Value Your Feedback</Text>
            <Text style={styles.feedbackText}>
              Help us improve your learning experience by sharing your thoughts
            </Text>
            
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F3',
    paddingTop:30,
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
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#D9A299',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#DCC5B2',
    textAlign: 'center',
  },
  introCard: {
    backgroundColor: '#F0E4D3',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#D9A299',
    marginBottom: 12,
  },
  introText: {
    fontSize: 15,
    color: '#8A6D5B',
    marginBottom: 16,
    lineHeight: 22,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  featureItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#8A6D5B',
    marginLeft: 8,
  },
  feedbackCard: {
    backgroundColor: '#D9A299',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  feedbackTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FAF7F3',
    marginVertical: 12,
    textAlign: 'center',
  },
  feedbackText: {
    fontSize: 15,
    color: '#FAF7F3',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0E4D3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  feedbackButtonText: {
    color: '#D9A299',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default HomeScreen;
