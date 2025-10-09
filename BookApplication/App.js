import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import AddBookScreen from './screens/AddBookScreen.js';
import ListBookScreen from './screens/ListBookScreen.js';


export default function App() {

  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='addbook'>
        <Stack.Screen name='addbook' component={AddBookScreen} options={{headerShown:false}} />
        <Stack.Screen name='listbook' component={ListBookScreen} options={{headerShown:false}} />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
