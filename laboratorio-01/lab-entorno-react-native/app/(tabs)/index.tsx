import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Desarrollo de Aplicaciones Móviles</Text>
      <Text style={styles.mensaje}>Bienvenido a tu primera app en React Native</Text>
      <Text style={styles.autor}>Autor: Nicole Sobrino</Text>
      <Text style={styles.detalle}>Proyecto creado con Expo</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  mensaje: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  autor: {
    fontSize: 15,
    marginBottom: 6,
  },
  detalle: {
    fontSize: 14,
    color: '#555555',
  },
});