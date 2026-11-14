import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@local_reminders_v1';

// Configuración de cómo se mostrarán las notificaciones cuando la app esté abierta
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [title, setTitle] = useState('');
  const [seconds, setSeconds] = useState('');
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    solicitarPermisos();
    cargarRecordatorios();
  }, []);

  // 1. Solicitar permisos de notificación (Android 13+ e iOS)
  const solicitarPermisos = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Aviso', 'Las notificaciones locales nativas requieren un dispositivo móvil (Expo Go).');
      return;
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        setPermissionGranted(false);
        Alert.alert(
          'Permiso denegado',
          'No se concedieron permisos para mostrar notificaciones. Actívalos en los ajustes.'
        );
        return;
      }

      setPermissionGranted(true);
    } else {
      Alert.alert('Aviso', 'Debes probar las notificaciones en un dispositivo físico.');
    }
  };

  // 2. Cargar recordatorios guardados en AsyncStorage al iniciar
  const cargarRecordatorios = async () => {
    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedData !== null) {
        setReminders(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Error al cargar recordatorios:', error);
    }
  };

  // Guardar lista actualizada en AsyncStorage
  const guardarEnStorage = async (nuevaLista) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nuevaLista));
    } catch (error) {
      console.error('Error al guardar en AsyncStorage:', error);
    }
  };

  // 3. Programar notificación y guardar recordatorio
  const crearRecordatorio = async () => {
    if (!title.trim()) {
      Alert.alert('Validación', 'Por favor, ingresa un título para el recordatorio.');
      return;
    }

    const triggerSeconds = parseInt(seconds, 10);
    if (isNaN(triggerSeconds) || triggerSeconds <= 0) {
      Alert.alert('Validación', 'Ingresa un tiempo válido en segundos (mayor a 0).');
      return;
    }

    if (!permissionGranted && Platform.OS !== 'web') {
      Alert.alert('Sin permisos', 'Debes conceder permisos de notificación primero.');
      solicitarPermisos();
      return;
    }

    try {
      let notificationId = 'web-mock-id';

      // Programar la notificación real en dispositivos móviles
      if (Platform.OS !== 'web') {
        notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: '⏰ Recordatorio',
            body: title.trim(),
            sound: true,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: triggerSeconds,
          },
        });
      }

      const nuevoRecordatorio = {
        id: Date.now().toString(),
        title: title.trim(),
        trigger: triggerSeconds,
        notificationId: notificationId,
        createdAt: new Date().toLocaleTimeString(),
      };

      const listaActualizada = [nuevoRecordatorio, ...reminders];
      setReminders(listaActualizada);
      await guardarEnStorage(listaActualizada);

      setTitle('');
      setSeconds('');
      Alert.alert('Programado', `Recordatorio "${nuevoRecordatorio.title}" sonará en ${triggerSeconds}s.`);
    } catch (error) {
      Alert.alert('Error', 'No se pudo programar la notificación.');
      console.error(error);
    }
  };

  // 4. Eliminar recordatorio y cancelar notificación programada
  const eliminarRecordatorio = async (item) => {
    try {
      if (Platform.OS !== 'web' && item.notificationId) {
        await Notifications.cancelScheduledNotificationAsync(item.notificationId);
      }

      const listaFiltrada = reminders.filter((r) => r.id !== item.id);
      setReminders(listaFiltrada);
      await guardarEnStorage(listaFiltrada);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cancelar la notificación.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Local ReminderApp</Text>

      {/* Indicador de estado de permisos */}
      <View style={[styles.badge, permissionGranted ? styles.badgeSuccess : styles.badgeWarning]}>
        <Text style={styles.badgeText}>
          {permissionGranted ? '✅ Notificaciones Habilitadas' : '⚠️ Permisos Pendientes o Web'}
        </Text>
      </View>

      {/* Formulario de creación */}
      <View style={styles.card}>
        <Text style={styles.label}>Título del recordatorio:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. Tomar agua, Estudiar..."
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Tiempo (en segundos):</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. 10"
          keyboardType="numeric"
          value={seconds}
          onChangeText={setSeconds}
        />

        <TouchableOpacity style={styles.primaryButton} onPress={crearRecordatorio}>
          <Text style={styles.primaryButtonText}>Programar Recordatorio</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de recordatorios activos */}
      <Text style={styles.sectionTitle}>Recordatorios Guardados ({reminders.length})</Text>

      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay recordatorios programados aún.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.reminderItem}>
            <View style={styles.reminderInfo}>
              <Text style={styles.reminderTitle}>{item.title}</Text>
              <Text style={styles.reminderSub}>
                ⏱️ En {item.trigger} seg • Creado: {item.createdAt}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => eliminarRecordatorio(item)}
            >
              <Text style={styles.deleteButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 12,
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 16,
  },
  badgeSuccess: {
    backgroundColor: '#dcfce7',
  },
  badgeWarning: {
    backgroundColor: '#fef3c7',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    marginBottom: 12,
    backgroundColor: '#f8fafc',
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 30,
  },
  emptyText: {
    textAlign: 'center',
    color: '#64748b',
    marginTop: 20,
    fontStyle: 'italic',
  },
  reminderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  reminderInfo: {
    flex: 1,
    paddingRight: 10,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  reminderSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#dc2626',
    fontWeight: '600',
    fontSize: 13,
  },
});