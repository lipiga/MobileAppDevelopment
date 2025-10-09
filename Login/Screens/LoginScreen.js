import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import {
  KeyboardAvoidingView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = () => {
    
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  const onLogin = async (e) => {
    e.preventDefault();
    const payload = { email, password };
    try {
      const response = await axios.post("http://192.168.1.5:4000/api/user/login", payload, {
        headers: { 'Content-Type': 'application/json' }
      });
      Toast.show({
        type: response.data.success ? 'success' : 'error',
        text1: response.data.success ? 'Success' : 'Error',
        text2: response.data.message,
        position: 'top',
      });
      if (response.data.success) {
        console.log(response.data.message);
        setEmail("");
        setPassword("");
        navigation.navigate('map');
      } else {
        console.log("error");
      }
    } catch (error) {
      console.log("Axios Error: ", JSON.stringify(error.response?.data || error.message));
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || error.message || 'An error occurred during login',
        position: 'top',
      });
    }

  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="person-add" size={28} color="#fff" />
          </View>
          <Text style={styles.title}>Login To Your Account</Text>
          <Text style={styles.subtitle}>Welcome Back to our community</Text>
        </View>


        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#b8a1d1" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder='Email Address'
            placeholderTextColor="#b8a1d1"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#b8a1d1" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder='Password'
            placeholderTextColor="#b8a1d1"
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#b8a1d1"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={onLogin}
        >
          <Text style={styles.buttonText}>Login</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('register')}>
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f5ff',
  },
  innerContainer: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',

  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    backgroundColor: '#d1b3ff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#d1b3ff',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#9a7bb8',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#b8a1d1',
  },
  message: {
    textAlign: 'center',
    color: '#ff9bb3',
    marginBottom: 20,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f0e5ff',
    shadowColor: '#e0c3ff',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
    height: 60,
  },
  inputIcon: {
    marginRight: 15,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#8a6fa8',
    fontSize: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d1b3ff',
    paddingVertical: 18,
    borderRadius: 15,
    marginTop: 15,
    shadowColor: '#d1b3ff',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    color: '#b8a1d1',
    marginRight: 5,
  },
  footerLink: {
    color: '#d1b3ff',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
