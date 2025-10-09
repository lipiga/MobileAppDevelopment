import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';

export default function App() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState('');
  const [unitSystem, setUnitSystem] = useState('metric'); // 'metric' or 'imperial'

  const calculateBMI = () => {
    // Validate inputs
    if (!weight || !height) {
      Alert.alert('Error', 'Please enter both weight and height');
      return;
    }

    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (isNaN(weightNum) || isNaN(heightNum) || weightNum <= 0 || heightNum <= 0) {
      Alert.alert('Error', 'Please enter valid positive numbers');
      return;
    }

    let calculatedBMI;

    if (unitSystem === 'metric') {
      // BMI = weight(kg) / (height(m) * height(m))
      calculatedBMI = weightNum / ((heightNum / 100) * (heightNum / 100));
    } else {
      // BMI = (weight(lbs) / (height(in) * height(in))) * 703
      calculatedBMI = (weightNum / (heightNum * heightNum)) * 703;
    }

    const roundedBMI = calculatedBMI.toFixed(1);
    setBmi(roundedBMI);
    determineCategory(roundedBMI);
  };

  const determineCategory = (bmiValue) => {
    const bmiNum = parseFloat(bmiValue);
    
    if (bmiNum < 18.5) {
      setCategory('Underweight');
    } else if (bmiNum >= 18.5 && bmiNum < 25) {
      setCategory('Normal weight');
    } else if (bmiNum >= 25 && bmiNum < 30) {
      setCategory('Overweight');
    } else {
      setCategory('Obese');
    }
  };

  const resetCalculator = () => {
    setWeight('');
    setHeight('');
    setBmi(null);
    setCategory('');
  };

  const toggleUnitSystem = () => {
    setUnitSystem(unitSystem === 'metric' ? 'imperial' : 'metric');
    resetCalculator();
  };

  const getCategoryColor = () => {
    switch (category) {
      case 'Underweight':
        return '#FFA500'; // Orange
      case 'Normal weight':
        return '#4CAF50'; // Green
      case 'Overweight':
        return '#FF9800'; // Orange
      case 'Obese':
        return '#F44336'; // Red
      default:
        return '#666';
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Body Mass Calculator</Text>
          <Text style={styles.subtitle}>Calculate your BMI</Text>
        </View>

        {/* Unit System Toggle */}
        <View style={styles.unitToggleContainer}>
          <Text style={styles.unitLabel}>Unit System:</Text>
          <TouchableOpacity 
            style={styles.unitToggle} 
            onPress={toggleUnitSystem}
          >
            <Text style={styles.unitToggleText}>
              {unitSystem === 'metric' ? 'Metric (kg, cm)' : 'Imperial (lbs, in)'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Input Fields */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})
          </Text>
          <TextInput
            style={styles.input}
            placeholder={`Enter weight in ${unitSystem === 'metric' ? 'kilograms' : 'pounds'}`}
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />

          <Text style={styles.label}>
            Height ({unitSystem === 'metric' ? 'cm' : 'in'})
          </Text>
          <TextInput
            style={styles.input}
            placeholder={`Enter height in ${unitSystem === 'metric' ? 'centimeters' : 'inches'}`}
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={height}
            onChangeText={setHeight}
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.calculateButton} 
            onPress={calculateBMI}
          >
            <Text style={styles.calculateButtonText}>Calculate BMI</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.resetButton} 
            onPress={resetCalculator}
          >
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>

        {/* Results */}
        {bmi && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Your Results</Text>
            
            <View style={styles.bmiContainer}>
              <Text style={styles.bmiLabel}>BMI</Text>
              <Text style={styles.bmiValue}>{bmi}</Text>
            </View>

            <View style={[styles.categoryContainer, { borderColor: getCategoryColor() }]}>
              <Text style={styles.categoryLabel}>Category</Text>
              <Text style={[styles.categoryValue, { color: getCategoryColor() }]}>
                {category}
              </Text>
            </View>

            {/* BMI Scale Info */}
            <View style={styles.scaleContainer}>
              <Text style={styles.scaleTitle}>BMI Scale:</Text>
              <View style={styles.scaleItem}>
                <View style={[styles.scaleColor, { backgroundColor: '#FFA500' }]} />
                <Text style={styles.scaleText}>Underweight: Below 18.5</Text>
              </View>
              <View style={styles.scaleItem}>
                <View style={[styles.scaleColor, { backgroundColor: '#4CAF50' }]} />
                <Text style={styles.scaleText}>Normal weight: 18.5 - 24.9</Text>
              </View>
              <View style={styles.scaleItem}>
                <View style={[styles.scaleColor, { backgroundColor: '#FF9800' }]} />
                <Text style={styles.scaleText}>Overweight: 25 - 29.9</Text>
              </View>
              <View style={styles.scaleItem}>
                <View style={[styles.scaleColor, { backgroundColor: '#F44336' }]} />
                <Text style={styles.scaleText}>Obese: 30 and above</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  unitToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  unitLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  unitToggle: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  unitToggleText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
    marginLeft: 5,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  calculateButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  calculateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resetButton: {
    flex: 0.4,
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  resultContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  bmiContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  bmiLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  bmiValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  categoryContainer: {
    alignItems: 'center',
    marginBottom: 25,
    padding: 15,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#4CAF50',
  },
  categoryLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  categoryValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scaleContainer: {
    marginTop: 10,
  },
  scaleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  scaleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  scaleColor: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 10,
  },
  scaleText: {
    fontSize: 14,
    color: '#555',
  },
});
