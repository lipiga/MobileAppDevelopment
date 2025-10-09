import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

export default function App() {
  const [productName, setProductName] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [finalPrice, setFinalPrice] = useState(null);

  const discountOptions = [
    { id: 1, name: 'Credit Card', discount: 10, description: '10% off on credit card payments' },
    { id: 2, name: 'Wallet', discount: 15, description: '15% off with Wallet' },
    { id: 3, name: 'Debit Card', discount: 20, description: '20% off for Debit Card Payments' },
    { id: 4, name: 'UPI', discount: 25, description: '25% off for UPI payments' },
  ];

  const calculateDiscount = () => {
    if (!productName.trim()) {
      Alert.alert('Error', 'Please enter product name');
      return;
    }

    if (!originalPrice || isNaN(originalPrice) || parseFloat(originalPrice) <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    if (!selectedDiscount) {
      Alert.alert('Error', 'Please select a discount option');
      return;
    }

    const price = parseFloat(originalPrice);
    const discountAmount = (price * selectedDiscount.discount) / 100;
    const discountedPrice = price - discountAmount;

    setFinalPrice({
      original: price,
      discountAmount: discountAmount,
      final: discountedPrice,
      discountPercent: selectedDiscount.discount
    });
  };

  const resetCalculator = () => {
    setProductName('');
    setOriginalPrice('');
    setSelectedDiscount(null);
    setFinalPrice(null);
  };

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>🛍️ Price Discount Calculator</Text>
        
        {/* Product Input Section */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Product Information</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Enter product name"
            value={productName}
            onChangeText={setProductName}
            placeholderTextColor="#999"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Enter original price ($)"
            value={originalPrice}
            onChangeText={setOriginalPrice}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </View>

        {/* Discount Options Section */}
        <View style={styles.discountSection}>
          <Text style={styles.sectionTitle}>Select Discount Type</Text>
          
          {discountOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.discountOption,
                selectedDiscount?.id === option.id && styles.selectedOption
              ]}
              onPress={() => setSelectedDiscount(option)}
            >
              <View style={styles.optionContent}>
                <Text style={styles.optionName}>{option.name}</Text>
                <Text style={styles.optionDiscount}>{option.discount}% OFF</Text>
              </View>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.calculateButton]}
            onPress={calculateDiscount}
          >
            <Text style={styles.buttonText}>Calculate Discount</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.resetButton]}
            onPress={resetCalculator}
          >
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        </View>

        {/* Results Section */}
        {finalPrice && (
          <View style={styles.resultSection}>
            <Text style={styles.resultTitle}>💰 Discount Calculation</Text>
            
            <View style={styles.resultCard}>
              <Text style={styles.productName}>{productName}</Text>
              
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Original Price:</Text>
                <Text style={styles.originalPrice}>{formatCurrency(finalPrice.original)}</Text>
              </View>
              
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Discount ({finalPrice.discountPercent}%):</Text>
                <Text style={styles.discountAmount}>-{formatCurrency(finalPrice.discountAmount)}</Text>
              </View>
              
              <View style={styles.separator} />
              
              <View style={styles.priceRow}>
                <Text style={styles.finalPriceLabel}>Final Price:</Text>
                <Text style={styles.finalPrice}>{formatCurrency(finalPrice.final)}</Text>
              </View>
              
              <Text style={styles.savingsText}>
                You save {formatCurrency(finalPrice.discountAmount)}!
              </Text>
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
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  inputSection: {
    marginBottom: 25,
  },
  discountSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#444',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  discountOption: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  selectedOption: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  optionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  optionDiscount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  optionDescription: {
    fontSize: 12,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  calculateButton: {
    backgroundColor: '#007AFF',
  },
  resetButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resultSection: {
    marginBottom: 30,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  resultCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 16,
    color: '#666',
  },
  originalPrice: {
    fontSize: 16,
    color: '#666',
    textDecorationLine: 'line-through',
  },
  discountAmount: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
  finalPriceLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  finalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  savingsText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
    color: '#28a745',
    fontWeight: '600',
  },
});
