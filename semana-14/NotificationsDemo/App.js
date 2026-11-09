import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// Configurar el manejador global de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [token, setToken] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('no_solicitado');

  // Función para solicitar permisos y obtener el token del dispositivo
  async function registerForPushNotificationsAsync() {
    let finalStatus = 'no_solicitado';

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      setPermissionStatus(finalStatus);

      if (finalStatus !== 'granted') {
        Alert.alert('Permiso denegado', 'Permiso para notificaciones denegado');
        return;
      }

      try {
        const pushTokenData = await Notifications.getExpoPushTokenAsync();
        setToken(pushTokenData.data);
        console.log('Token del dispositivo:', pushTokenData.data);
      } catch (e) {
        console.error('Error al obtener el token:', e);
      }
    } else {
      Alert.alert('Aviso', 'Debes usar un dispositivo físico para notificaciones push completas');
    }
  }

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  // Función para programar una notificación local en 5 segundos
  async function scheduleNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Notificación",
        body: "Esta es una prueba de notificación local.",
      },
      trigger: { seconds: 5 },
    });
    Alert.alert('Éxito', 'Notificación programada para dentro de 5 segundos.');
  }

  // Estilo y color dinámico según el estado del permiso
  const getStatusDisplay = () => {
    if (permissionStatus === 'granted') return { text: 'Permiso concedido', color: '#16a34a' };
    if (permissionStatus === 'denied') return { text: 'Permiso denegado', color: '#dc2626' };
    return { text: 'No solicitado / Pendiente', color: '#d97706' };
  };

  const statusInfo = getStatusDisplay();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Notifications Demo</Text>

      {/* Estado dinámico del permiso */}
      <View style={styles.section}>
        <Text style={styles.label}>Estado del permiso:</Text>
        <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.text}</Text>
      </View>

      {/* Visualización del Token */}
      <View style={styles.section}>
        <Text style={styles.label}>Token de dispositivo:</Text>
        <Text selectable style={styles.tokenText}>
          {token ? token : 'Cargando token o requiere dispositivo físico...'}
        </Text>
      </View>

      {/* Botones de acción */}
      <View style={styles.buttonContainer}>
        <Button title="Programar notificación (5s)" onPress={scheduleNotification} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Solicitar permiso nuevamente" onPress={registerForPushNotificationsAsync} color="#2563eb" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f7f9fc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#334155',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tokenText: {
    fontSize: 13,
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    padding: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 12,
  },
});