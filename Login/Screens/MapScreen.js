import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import Toast from 'react-native-toast-message';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function MapScreen() {
  const DEST_LAT = 9.882438;
  const DEST_LNG = 78.083825;
  const [location, setLocation] = useState(null);
  const [distanceFromDestination, setDistanceFromDestination] = useState(null);

  useEffect(() => {
    let interval;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({
          type: 'error',
          text1: 'Location Permission Denied',
        });
        return;
      }

      // Start polling every 10 seconds
      interval = setInterval(async () => {
        let loc = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = loc.coords;
        setLocation(loc.coords);

        const distance = getDistance(latitude, longitude, DEST_LAT, DEST_LNG);
        setDistanceFromDestination(distance.toFixed(2)); // in meters

        if (distance <= 3) {
          Toast.show({
            type: 'success',
            text1: '📍 Destination Reached',
          });
        } else {
          Toast.show({
            type: 'info',
            text1: 'You are too far from destination',
          });
        }
      }, 10000); // 10 seconds
    })();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📍 Live Map Tracker</Text>

      {location && (
        <MapView
          style={styles.map}
          showsUserLocation={true}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{ latitude: DEST_LAT, longitude: DEST_LNG }}
            title="Destination"
          />
        </MapView>
      )}

      {distanceFromDestination !== null && (
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Distance from destination: {distanceFromDestination} meters
          </Text>
        </View>
      )}

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 110,
    alignItems: 'center',
    backgroundColor: '#f9f5ff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color:'#9a7bb8',
  },
  map: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH * 1.4 ,
    borderRadius: 12,
  },
  infoBox: {
    marginTop: 20,
    backgroundColor: '#d1b3ff',
    padding: 12,
    borderRadius: 10,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
});

