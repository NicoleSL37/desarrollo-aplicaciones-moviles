import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso denegado para GPS');
        return;
      }
      
      let current = await Location.getCurrentPositionAsync({});
      setLocation(current.coords);
    })();

    Accelerometer.setUpdateInterval(100);
    const subscription = Accelerometer.addListener(accelerometerData => {
      setData(accelerometerData);
    });

    return () => subscription && subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sensores del Dispositivo</Text>
      
      {location ? (
        <>
          <Text>Latitud: {location.latitude.toFixed(4)}</Text>
          <Text>Longitud: {location.longitude.toFixed(4)}</Text>
        </>
      ) : (
        <Text>Obteniendo ubicación...</Text>
      )}

      <Text style={{ marginTop: 20 }}>
        Acelerómetro x: {data.x.toFixed(2)} | y: {data.y.toFixed(2)} | z: {data.z.toFixed(2)}
      </Text>
      
      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  error: { color: 'red', marginTop: 10 },
});