import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar 
} from 'react-native';

export default function App() {
  const [displayValue, setDisplayValue] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const inputNumber = (num) => {
    if (waitingForNewValue) {
      setDisplayValue(String(num));
      setWaitingForNewValue(false);
    } else {
      setDisplayValue(displayValue === '0' ? String(num) : displayValue + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForNewValue) {
      setDisplayValue('0.');
      setWaitingForNewValue(false);
    } else if (displayValue.indexOf('.') === -1) {
      setDisplayValue(displayValue + '.');
    }
  };

  const clearAll = () => {
    setDisplayValue('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(displayValue);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplayValue(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      default:
        return secondValue;
    }
  };

  const equals = () => {
    const inputValue = parseFloat(displayValue);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      
      setDisplayValue(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const percentage = () => {
    const currentValue = parseFloat(displayValue);
    setDisplayValue(String(currentValue / 100));
  };

  const toggleSign = () => {
    const currentValue = parseFloat(displayValue);
    setDisplayValue(String(-currentValue));
  };

  const Button = ({ title, onPress, style, textStyle }) => (
    <TouchableOpacity 
      style={[styles.button, style]} 
      onPress={onPress}
    >
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Display */}
      <View style={styles.displayContainer}>
        <Text style={styles.displayText} numberOfLines={1}>
          {displayValue}
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <View style={styles.row}>
          <Button title="AC" onPress={clearAll} style={styles.functionButton} />
          <Button title="+/-" onPress={toggleSign} style={styles.functionButton} />
          <Button title="%" onPress={percentage} style={styles.functionButton} />
          <Button title="÷" onPress={() => performOperation('÷')} style={styles.operationButton} />
        </View>

        <View style={styles.row}>
          <Button title="7" onPress={() => inputNumber(7)} style={styles.numberButton} />
          <Button title="8" onPress={() => inputNumber(8)} style={styles.numberButton} />
          <Button title="9" onPress={() => inputNumber(9)} style={styles.numberButton} />
          <Button title="×" onPress={() => performOperation('×')} style={styles.operationButton} />
        </View>

        <View style={styles.row}>
          <Button title="4" onPress={() => inputNumber(4)} style={styles.numberButton} />
          <Button title="5" onPress={() => inputNumber(5)} style={styles.numberButton} />
          <Button title="6" onPress={() => inputNumber(6)} style={styles.numberButton} />
          <Button title="-" onPress={() => performOperation('-')} style={styles.operationButton} />
        </View>

        <View style={styles.row}>
          <Button title="1" onPress={() => inputNumber(1)} style={styles.numberButton} />
          <Button title="2" onPress={() => inputNumber(2)} style={styles.numberButton} />
          <Button title="3" onPress={() => inputNumber(3)} style={styles.numberButton} />
          <Button title="+" onPress={() => performOperation('+')} style={styles.operationButton} />
        </View>

        <View style={styles.row}>
          <Button title="0" onPress={() => inputNumber(0)} style={styles.zeroButton} />
          <Button title="." onPress={inputDecimal} style={styles.numberButton} />
          <Button title="=" onPress={equals} style={styles.operationButton} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  displayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 20,
  },
  displayText: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '300',
  },
  buttonsContainer: {
    flex: 2,
    padding: 10,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 50,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: '400',
    color: '#fff',
  },
  numberButton: {
    backgroundColor: '#333',
  },
  zeroButton: {
    flex: 2,
    backgroundColor: '#333',
    alignItems: 'flex-start',
    paddingLeft: 30,
  },
  functionButton: {
    backgroundColor: '#a5a5a5',
  },
  operationButton: {
    backgroundColor: '#f1a33c',
  },
});
