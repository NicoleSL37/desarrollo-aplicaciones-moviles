import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, Linking, ScrollView } from 'react-native';
import * as Camera from 'expo-camera';
import * as Location from 'expo-location';

export default function App() {
  const [cam, setCam] = useState(null);
  const [gps, setGps] = useState(null);

  // Función para verificar el estado actual de los permisos sin solicitarlos
  const verificar = async () => {
    try {
      const cameraStatus = await Camera.getCameraPermissionsAsync();
      const locationStatus = await Location.getForegroundPermissionsAsync();
      setCam(cameraStatus);
      setGps(locationStatus);
    } catch (e) {
      Alert.alert('Error', 'No se pudieron consultar los permisos');
    }
  };

  useEffect(() => {
    verificar();
  }, []);

  // Solicitar permiso de Cámara
  const pedirCamara = async () => {
    try {
      const r = await Camera.requestCameraPermissionsAsync();
      setCam(r);
    } catch (e) {
      Alert.alert('Error', 'Fallo al pedir permiso de cámara');
    }
  };

  // Solicitar permiso de Ubicación
  const pedirUbicacion = async () => {
    try {
      const r = await Location.requestForegroundPermissionsAsync();
      setGps(r);
    } catch (e) {
      Alert.alert('Error', 'Fallo al pedir permiso de ubicación');
    }
  };

  // Etiqueta descriptiva según el estado del permiso
  const etiqueta = (r) => {
    if (!r) return 'No consultado';
    if (r.status === 'granted') return 'Concedido';
    if (r.status === 'denied') return 'Denegado';
    return 'No determinado';
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Panel de Permisos</Text>

      {/* Sección Cámara */}
      <View style={styles.section}>
        <Text style={styles.label}>Cámara: {etiqueta(cam)}</Text>
        <Text style={styles.description}>Necesaria para capturar evidencias fotográficas dentro de la app.</Text>
        <Button title="Solicitar Cámara" onPress={pedirCamara} />
      </View>

      {/* Sección Ubicación */}
      <View style={styles.section}>
        <Text style={styles.label}>Ubicación: {etiqueta(gps)}</Text>
        <Text style={styles.description}>Necesaria para geolocalizar al usuario en el mapa.</Text>
        <Button title="Solicitar Ubicación" onPress={pedirUbicacion} />
      </View>

      <View style={styles.gap} />
      <Button title="Verificar nuevamente" onPress={verificar} color="#2563eb" />

      {/* Alerta de bloqueo permanente */}
      {((cam?.status === 'denied' && !cam.canAskAgain) ||
        (gps?.status === 'denied' && !gps.canAskAgain)) && (
        <View style={styles.blockedContainer}>
          <Text style={styles.blockedText}>Permiso bloqueado permanentemente: cámbialo manualmente en los Ajustes.</Text>
          <Button title="Abrir Ajustes" onPress={() => Linking.openSettings()} color="#dc2626" />
        </View>
      )}

      <Text style={styles.note}>
        Puedes negar un permiso: la app debe seguir funcionando de forma segura.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f7f9fc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#1e293b',
  },
  section: {
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
    marginBottom: 4,
    color: '#334155',
  },
  description: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 12,
  },
  gap: {
    marginTop: 12,
    marginBottom: 12,
  },
  blockedContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
  },
  blockedText: {
    color: '#991b1b',
    marginBottom: 8,
    fontSize: 14,
  },
  note: {
    marginTop: 24,
    color: '#475569',
    textAlign: 'center',
    fontSize: 12,
  },
});