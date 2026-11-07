import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import * as Camera from 'expo-camera';
import * as Location from 'expo-location';

export default function App() {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  const [location, setLocation] = useState(null);

  // Función para solicitar permisos y obtener la ubicación si es concedida
  const solicitarPermisos = async () => {
    try {
      // Solicitar permiso de cámara
      const camStatus = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(camStatus.status);

      // Solicitar permiso de ubicación
      const locStatus = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(locStatus.status);

      // Si el GPS fue concedido, obtenemos las coordenadas actuales
      if (locStatus.status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation.coords);
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un fallo al solicitar los permisos.');
    }
  };

  useEffect(() => {
    solicitarPermisos();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Permissions Demo</Text>

      {/* Estado de Cámara */}
      <View style={styles.section}>
        <Text style={styles.label}>
          Cámara: {cameraPermission === 'granted' ? 'Permitido' : cameraPermission === 'denied' ? 'Denegado' : 'No solicitado'}
        </Text>
      </View>

      {/* Estado de Ubicación y Coordenadas */}
      <View style={styles.section}>
        <Text style={styles.label}>
          Ubicación: {locationPermission === 'granted' ? 'Permitido' : locationPermission === 'denied' ? 'Denegado' : 'No solicitado'}
        </Text>

        {locationPermission === 'granted' && location && (
          <Text style={styles.coords}>
            Lat: {location.latitude.toFixed(4)} | Lon: {location.longitude.toFixed(4)}
          </Text>
        )}
      </View>

      {/* Renderizado condicional según laboratorio */}
      {cameraPermission === 'granted' && (
        <Text style={styles.readyText}>La cámara está lista para usarse</Text>
      )}

      <View style={styles.gap}>
        <Button title="Reintentar permisos" onPress={solicitarPermisos} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f7f9fc',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#1e293b',
  },
  section: {
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
    color: '#334155',
  },
  coords: {
    marginTop: 10,
    fontSize: 15,
    fontStyle: 'italic',
    color: '#64748b',
  },
  readyText: {
    marginTop: 10,
    color: '#16a34a',
    fontWeight: '600',
  },
  gap: {
    marginTop: 20,
    width: '100%',
  },
});