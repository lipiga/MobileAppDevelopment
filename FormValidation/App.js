import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import FormScreen from './screens/FormScreen';
import Toast from 'react-native-toast-message';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// This component holds your bottom tab navigator
function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home" // Makes sure Home is shown first
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Form') {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#D9A299',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{headerShown: false}} />
      <Tab.Screen name="Form" component={FormScreen} options={{headerShown: false}} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          // Render Login screen first
          <Stack.Screen name="Login">
            {(props) => (
              <LoginScreen
                {...props}
                setLogin={() => setIsLoggedIn(true)} // Call this when login succeeds
              />
            )}
          </Stack.Screen>
        ) : (
          // After login, switch to tab navigation
          <Stack.Screen name="MainTabs" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
    <Toast />
    </>
  );
}
