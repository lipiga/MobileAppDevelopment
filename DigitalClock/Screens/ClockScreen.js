import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  Dimensions,
  Animated,
  Easing
} from 'react-native';
import Toast from 'react-native-toast-message';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const clockSize = width * 0.7;

const ClockScreen = () => {
  // Updated color palette
  const colors = {
    lightBg: '#DAD7CD',
    lightSecondary: '#A3B18A',
    darkSecondary: '#588157',
    darkPrimary: '#3A5A40',
    darkest: '#344E41',
    textDark: '#344E41',
    textLight: '#FFFFFF',
    clockFaceLight: '#FFFFFF',
    clockFaceDark: '#344E41',
    hourHand: '#3A5A40',
    minuteHand: '#588157',
    secondHand: '#A3B18A',
    highlight: '#588157'
  };

  // States
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timerModalVisible, setTimerModalVisible] = useState(false);
  const [timerHours, setTimerHours] = useState('0');
  const [timerMinutes, setTimerMinutes] = useState('0');
  const [timerSeconds, setTimerSeconds] = useState('0');
  const [remainingTime, setRemainingTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Clock animations
  const [secondHandAnim] = useState(new Animated.Value(0));
  const [minuteHandAnim] = useState(new Animated.Value(0));
  const [hourHandAnim] = useState(new Animated.Value(0));

  // Update clock every second
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now);

      const seconds = now.getSeconds();
      const minutes = now.getMinutes();
      const hours = now.getHours() % 12;

      // Calculate angles with smooth transitions
      const secondAngle = seconds * 6;
      const minuteAngle = minutes * 6 + seconds * 0.1;
      const hourAngle = hours * 30 + minutes * 0.5;

      Animated.parallel([
        Animated.timing(secondHandAnim, {
          toValue: secondAngle,
          duration: 500,
          easing: Easing.elastic(0.5),
          useNativeDriver: true
        }),
        Animated.timing(minuteHandAnim, {
          toValue: minuteAngle,
          duration: 500,
          easing: Easing.elastic(0.5),
          useNativeDriver: true
        }),
        Animated.timing(hourHandAnim, {
          toValue: hourAngle,
          duration: 500,
          easing: Easing.elastic(0.5),
          useNativeDriver: true
        })
      ]).start();
    };

    const interval = setInterval(updateClock, 1000);
    updateClock();
    return () => clearInterval(interval);
  }, []);

  // Timer logic
  useEffect(() => {
    let interval;
    if (isTimerRunning && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime(prev => prev - 1);
      }, 1000);
    } else if (remainingTime === 0 && isTimerRunning) {
      setTimerModalVisible(false);
      setIsTimerRunning(false);
      showTimeUpToast();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, remainingTime]);

  const showTimeUpToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Timer Completed!',
      text2: 'Your countdown has finished',
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
    });
  };

  const startTimer = () => {
    const totalSeconds = 
      parseInt(timerHours || '0') * 3600 + 
      parseInt(timerMinutes || '0') * 60 + 
      parseInt(timerSeconds || '0');
    
    if (totalSeconds <= 0) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Time',
        text2: 'Please set a valid time',
        position: 'bottom'
      });
      return;
    }
    
    setRemainingTime(totalSeconds);
    setIsTimerRunning(true);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setRemainingTime(0);
    setTimerHours('0');
    setTimerMinutes('0');
    setTimerSeconds('0');
  };

  const formatTime = (time) => time < 10 ? `0${time}` : time;

  const displayTimer = () => {
    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = remainingTime % 60;
    return `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
  };

  // Clock hand transforms
  const secondHandTransform = {
    transform: [{
      rotate: secondHandAnim.interpolate({
        inputRange: [0, 360],
        outputRange: ['0deg', '360deg']
      })
    }]
  };

  const minuteHandTransform = {
    transform: [{
      rotate: minuteHandAnim.interpolate({
        inputRange: [0, 360],
        outputRange: ['0deg', '360deg']
      })
    }]
  };

  const hourHandTransform = {
    transform: [{
      rotate: hourHandAnim.interpolate({
        inputRange: [0, 360],
        outputRange: ['0deg', '360deg']
      })
    }]
  };

  // Theme styles
  const containerStyles = {
    backgroundColor: isDarkMode ? colors.darkPrimary : colors.lightBg,
  };

  const textStyles = {
    color: isDarkMode ? colors.textLight : colors.textDark,
  };

  const buttonStyles = {
    backgroundColor: isDarkMode ? colors.darkSecondary : colors.lightSecondary,
  };

  // Clock numbers positions
  const clockNumbers = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const numberRadius = clockSize * 0.4; // Distance from center
  const numberSize = clockSize * 0.08;

  return (
    <View style={[styles.container, containerStyles]}>
      {/* Header with theme toggle */}
      <View style={styles.header}>
        <Text style={[styles.headerText, textStyles]}>Digital Clock App</Text>
        <TouchableOpacity 
          style={[styles.themeButton, buttonStyles]}
          onPress={() => setIsDarkMode(!isDarkMode)}
        >
          <MaterialIcons 
            name={isDarkMode ? 'wb-sunny' : 'nights-stay'} 
            size={24} 
            color={isDarkMode ? colors.textLight : colors.textDark} 
          />
        </TouchableOpacity>
      </View>

      {/* Beautiful Analog Clock with Numbers */}
      <View style={[styles.clockFace, {
        backgroundColor: isDarkMode ? colors.clockFaceDark : colors.clockFaceLight,
        borderColor: isDarkMode ? colors.darkSecondary : colors.lightSecondary
      }]}>
        {/* Clock numbers */}
        {clockNumbers.map((number, index) => {
          const angle = (index * 30) * (Math.PI / 180);
          const x = numberRadius * Math.sin(angle);
          const y = -numberRadius * Math.cos(angle);
          
          return (
            <View 
              key={number}
              style={[
                styles.clockNumberContainer,
                {
                  transform: [{ translateX: x }, { translateY: y }],
                  width: numberSize,
                  height: numberSize,
                }
              ]}
            >
              <Text style={[
                styles.clockNumber,
                {
                  fontSize: numberSize * 0.8,
                  color: isDarkMode ? colors.textLight : colors.textDark,
                }
              ]}>
                {number}
              </Text>
            </View>
          );
        })}
        
        {/* Clock hands */}
        <Animated.View style={[
          styles.hand, 
          styles.hourHand, 
          hourHandTransform,
          { backgroundColor: colors.hourHand }
        ]} />
        <Animated.View style={[
          styles.hand, 
          styles.minuteHand, 
          minuteHandTransform,
          { backgroundColor: colors.minuteHand }
        ]} />
        <Animated.View style={[
          styles.hand, 
          styles.secondHand, 
          secondHandTransform,
          { backgroundColor: colors.secondHand }
        ]} />
        
        {/* Center dot */}
        <View style={[styles.centerDot, { backgroundColor: colors.highlight }]} />
      </View>

      {/* Digital Display */}
      <View style={styles.digitalContainer}>
        <Text style={[styles.digitalTime, textStyles]}>
          {formatTime(currentTime.getHours())}:
          {formatTime(currentTime.getMinutes())}:
          {formatTime(currentTime.getSeconds())}
        </Text>
        <Text style={[styles.digitalDate, textStyles]}>
          {currentTime.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </Text>
      </View>

      {/* Timer Section */}
      <View style={[styles.timerSection, buttonStyles]}>
        <Text style={[styles.timerLabel, textStyles]}>TIMER</Text>
        <Text style={[styles.timerDisplay, textStyles]}>
          {isTimerRunning || remainingTime > 0 ? displayTimer() : '00:00:00'}
        </Text>
        <TouchableOpacity 
          style={[styles.timerControlButton, { backgroundColor: colors.highlight }]}
          onPress={() => setTimerModalVisible(true)}
        >
          <MaterialIcons name="timer" size={24} color="white" />
          <Text style={styles.timerControlText}>Timer Controls</Text>
        </TouchableOpacity>
      </View>

      {/* Timer Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={timerModalVisible}
        onRequestClose={() => setTimerModalVisible(false)}
      >
        <View style={[styles.modalContainer, { 
          backgroundColor: isDarkMode ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.7)' 
        }]}>
          <View style={[styles.modalContent, { 
            backgroundColor: isDarkMode ? colors.darkPrimary : colors.lightBg 
          }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, textStyles]}>Timer Settings</Text>
              <TouchableOpacity 
                onPress={() => {
                  setTimerModalVisible(false);
                  resetTimer();
                }}
              >
                <MaterialIcons 
                  name="close" 
                  size={28} 
                  color={isDarkMode ? colors.textLight : colors.textDark} 
                />
              </TouchableOpacity>
            </View>

            {isTimerRunning ? (
              <View style={styles.activeTimerContainer}>
                <Text style={[styles.activeTimerText, textStyles]}>{displayTimer()}</Text>
              </View>
            ) : (
              <View style={styles.timeInputContainer}>
                <View style={styles.timeInputGroup}>
                  <TextInput
                    style={[styles.timeInput, textStyles]}
                    keyboardType="numeric"
                    value={timerHours}
                    onChangeText={setTimerHours}
                    placeholder="00"
                    placeholderTextColor={isDarkMode ? '#AAAAAA' : '#888888'}
                    maxLength={2}
                  />
                  <Text style={[styles.timeSeparator, textStyles]}>:</Text>
                  <TextInput
                    style={[styles.timeInput, textStyles]}
                    keyboardType="numeric"
                    value={timerMinutes}
                    onChangeText={setTimerMinutes}
                    placeholder="00"
                    placeholderTextColor={isDarkMode ? '#AAAAAA' : '#888888'}
                    maxLength={2}
                  />
                  <Text style={[styles.timeSeparator, textStyles]}>:</Text>
                  <TextInput
                    style={[styles.timeInput, textStyles]}
                    keyboardType="numeric"
                    value={timerSeconds}
                    onChangeText={setTimerSeconds}
                    placeholder="00"
                    placeholderTextColor={isDarkMode ? '#AAAAAA' : '#888888'}
                    maxLength={2}
                  />
                </View>
              </View>
            )}

            <View style={styles.timerActionButtons}>
              {isTimerRunning ? (
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: colors.highlight }]}
                  onPress={() => setIsTimerRunning(false)}
                >
                  <MaterialIcons name="pause" size={24} color="white" />
                  <Text style={styles.actionButtonText}>Pause</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: colors.highlight }]}
                  onPress={startTimer}
                >
                  <MaterialIcons name="play-arrow" size={24} color="white" />
                  <Text style={styles.actionButtonText}>Start</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                style={[styles.actionButton, buttonStyles]}
                onPress={resetTimer}
              >
                <MaterialIcons 
                  name="replay" 
                  size={24} 
                  color={isDarkMode ? colors.textLight : colors.textDark} 
                />
                <Text style={[styles.actionButtonText, textStyles]}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 25,
    marginBottom: 30,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  themeButton: {
    padding: 10,
    borderRadius: 20,
    elevation: 3,
  },
  clockFace: {
    width: clockSize,
    height: clockSize,
    borderRadius: clockSize / 2,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
    marginBottom: 30,
  },
  clockNumberContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockNumber: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  hand: {
    position: 'absolute',
    borderRadius: 10,
    transformOrigin: 'center bottom',
  },
  hourHand: {
    width: 6,
    height: clockSize * 0.3,
    top: '50%',
    left: '50%',
    marginLeft: -3,
    marginTop: -clockSize * 0.3,
    zIndex: 3,
    elevation: 5,
  },
  minuteHand: {
    width: 4,
    height: clockSize * 0.4,
    top: '50%',
    left: '50%',
    marginLeft: -2,
    marginTop: -clockSize * 0.4,
    zIndex: 4,
    elevation: 6,
  },
  secondHand: {
    width: 2,
    height: clockSize * 0.45,
    top: '50%',
    left: '50%',
    marginLeft: -1,
    marginTop: -clockSize * 0.45,
    zIndex: 5,
    elevation: 7,
  },
  centerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    zIndex: 10,
  },
  digitalContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  digitalTime: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 5,
    letterSpacing: 1,
  },
  digitalDate: {
    fontSize: 18,
    fontWeight: '500',
    opacity: 0.8,
  },
  timerSection: {
    width: '90%',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  timerLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    letterSpacing: 1,
  },
  timerDisplay: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  timerControlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    elevation: 3,
  },
  timerControlText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    borderRadius: 20,
    padding: 25,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  activeTimerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  activeTimerText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  timeInputContainer: {
    marginBottom: 25,
  },
  timeInputGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeInput: {
    width: 70,
    fontSize: 36,
    textAlign: 'center',
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#588157',
    marginHorizontal: 5,
    paddingVertical: 5,
  },
  timeSeparator: {
    fontSize: 36,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
  timerActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    width: '48%',
    elevation: 3,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ClockScreen;
