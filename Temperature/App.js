import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Keyboard,
  TouchableWithoutFeedback,
  StatusBar 
} from 'react-native';

export default function App() {
  const [celsius, setCelsius] = useState('');
  const [fahrenheit, setFahrenheit] = useState('');

  const convertFromCelsius = (celsiusValue) => {
    if (celsiusValue === '') {
      setFahrenheit('');
      return;
    }

    const temp = parseFloat(celsiusValue);
    if (!isNaN(temp)) {
      // Celsius to Fahrenheit: (°C × 9/5) + 32
      const f = (temp * 9/5) + 32;
      setFahrenheit(f.toFixed(2));
    }
  };

  const convertFromFahrenheit = (fahrenheitValue) => {
    if (fahrenheitValue === '') {
      setCelsius('');
      return;
    }

    const temp = parseFloat(fahrenheitValue);
    if (!isNaN(temp)) {
      // Fahrenheit to Celsius: (°F - 32) × 5/9
      const c = (temp - 32) * 5/9;
      setCelsius(c.toFixed(2));
    }
  };

  const clearAll = () => {
    setCelsius('');
    setFahrenheit('');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        
        <Text style={styles.title}>Temperature Converter</Text>
        <Text style={styles.subtitle}>Celsius ↔ Fahrenheit</Text>
        
        {/* Celsius Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Celsius (°C)</Text>
          <TextInput
            style={styles.input}
            value={celsius}
            onChangeText={(text) => {
              setCelsius(text);
              convertFromCelsius(text);
            }}
            placeholder="Enter temperature"
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </View>

        {/* Fahrenheit Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Fahrenheit (°F)</Text>
          <TextInput
            style={styles.input}
            value={fahrenheit}
            onChangeText={(text) => {
              setFahrenheit(text);
              convertFromFahrenheit(text);
            }}
            placeholder="Enter temperature"
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </View>

        {/* Clear Button */}
        <TouchableOpacity style={styles.clearButton} onPress={clearAll}>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>

        {/* Conversion Formulas */}
        <View style={styles.formulasContainer}>
          <Text style={styles.formulasTitle}>Conversion Formulas:</Text>
          <Text style={styles.formula}>°F = (°C × 9/5) + 32</Text>
          <Text style={styles.formula}>°C = (°F - 32) × 5/9</Text>
        </View>

        {/* Quick Reference */}
        <View style={styles.referenceContainer}>
          <Text style={styles.referenceTitle}>Common Temperatures:</Text>
          <Text style={styles.referenceItem}>• Water Freezes: 0°C = 32°F</Text>
          <Text style={styles.referenceItem}>• Room Temperature: 20°C = 68°F</Text>
          <Text style={styles.referenceItem}>• Body Temperature: 37°C = 98.6°F</Text>
          <Text style={styles.referenceItem}>• Water Boils: 100°C = 212°F</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#444',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  clearButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  formulasContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 20,
  },
  formulasTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  formula: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    fontFamily: 'monospace',
  },
  referenceContainer: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bbdefb',
  },
  referenceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1565c0',
  },
  referenceItem: {
    fontSize: 14,
    color: '#1976d2',
    marginBottom: 4,
  },
});
