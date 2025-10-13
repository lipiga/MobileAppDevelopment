import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ImageBackground,
  StatusBar,
  SafeAreaView
} from 'react-native';

// Stack Navigator
const Stack = createStackNavigator();

// Static weather data
const weatherData = {
  'New York': {
    temperature: '22°C',
    humidity: '65%',
    condition: 'Sunny',
    weatherType: 'sunny',
    high: '25°C',
    low: '18°C',
    wind: '15 km/h'
  },
  'London': {
    temperature: '15°C',
    humidity: '80%',
    condition: 'Cloudy',
    weatherType: 'cloudy',
    high: '17°C',
    low: '12°C',
    wind: '20 km/h'
  },
  'Tokyo': {
    temperature: '28°C',
    humidity: '70%',
    condition: 'Rainy',
    weatherType: 'rainy',
    high: '30°C',
    low: '25°C',
    wind: '25 km/h'
  },
  'Paris': {
    temperature: '20°C',
    humidity: '60%',
    condition: 'Partly Cloudy',
    weatherType: 'partly-cloudy',
    high: '23°C',
    low: '16°C',
    wind: '12 km/h'
  },
  'Sydney': {
    temperature: '30°C',
    humidity: '45%',
    condition: 'Clear',
    weatherType: 'clear',
    high: '32°C',
    low: '25°C',
    wind: '18 km/h'
  }
};

// Weather background images (using placeholder URLs)
const weatherBackgrounds = {
  sunny: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=500',
  cloudy: 'https://images.unsplash.com/photo-1561484936-3f79c54d823a?w=500',
  rainy: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=500',
  'partly-cloudy': 'https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?w=500',
  clear: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500'
};

// Home Screen Component
function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Weather Dashboard</Text>
        <Text style={styles.headerSubtitle}>Select a city to view weather</Text>
      </View>
      
      <ScrollView style={styles.citiesList}>
        {Object.keys(weatherData).map((city) => (
          <TouchableOpacity
            key={city}
            style={styles.cityCard}
            onPress={() => navigation.navigate('CityDetail', { cityName: city })}
          >
            <View style={styles.cityInfo}>
              <Text style={styles.cityName}>{city}</Text>
              <Text style={styles.cityCondition}>{weatherData[city].condition}</Text>
            </View>
            <View style={styles.cityTemp}>
              <Text style={styles.temperature}>{weatherData[city].temperature}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// City Detail Screen Component
function CityDetailScreen({ route, navigation }) {
  const { cityName } = route.params;
  const cityWeather = weatherData[cityName];
  const backgroundImage = { uri: weatherBackgrounds[cityWeather.weatherType] };

  return (
    <ImageBackground 
      source={backgroundImage} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.detailContainer}>
        <StatusBar barStyle="light-content" />
        
        {/* Header */}
        <View style={styles.detailHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.detailCityName}>{cityName}</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Main Weather Info */}
        <View style={styles.weatherMain}>
          <Text style={styles.mainTemperature}>{cityWeather.temperature}</Text>
          <Text style={styles.mainCondition}>{cityWeather.condition}</Text>
        </View>

        {/* Weather Details */}
        <View style={styles.weatherDetails}>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Humidity</Text>
            <Text style={styles.detailValue}>{cityWeather.humidity}</Text>
          </View>
          
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>High / Low</Text>
            <Text style={styles.detailValue}>{cityWeather.high} / {cityWeather.low}</Text>
          </View>
          
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Wind Speed</Text>
            <Text style={styles.detailValue}>{cityWeather.wind}</Text>
          </View>
          
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Condition</Text>
            <Text style={styles.detailValue}>{cityWeather.condition}</Text>
          </View>
        </View>

        {/* Additional Info */}
        <View style={styles.additionalInfo}>
          <Text style={styles.infoTitle}>Weather Overview</Text>
          <Text style={styles.infoText}>
            {getWeatherDescription(cityWeather.weatherType)}
          </Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

// Helper function for weather descriptions
function getWeatherDescription(weatherType) {
  const descriptions = {
    sunny: "Perfect sunny day with clear skies. Great time for outdoor activities!",
    cloudy: "Cloudy skies with limited sunshine. A light jacket might be needed.",
    rainy: "Rainy conditions expected throughout the day. Don't forget your umbrella!",
    'partly-cloudy': "Mix of sun and clouds. Pleasant weather for the day.",
    clear: "Clear skies with excellent visibility. Perfect weather conditions."
  };
  return descriptions[weatherType] || "Weather conditions are normal for this time of year.";
}

// Main App Component
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CityDetail" component={CityDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  citiesList: {
    flex: 1,
    padding: 15,
  },
  cityCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cityInfo: {
    flex: 1,
  },
  cityName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cityCondition: {
    fontSize: 14,
    color: '#666',
  },
  cityTemp: {
    alignItems: 'flex-end',
  },
  temperature: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  // Detail Screen Styles
  backgroundImage: {
    flex: 1,
  },
  detailContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  detailCityName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  placeholder: {
    width: 60,
  },
  weatherMain: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  mainTemperature: {
    color: '#fff',
    fontSize: 72,
    fontWeight: '200',
  },
  mainCondition: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '300',
    marginTop: 8,
  },
  weatherDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 20,
  },
  detailCard: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  additionalInfo: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
