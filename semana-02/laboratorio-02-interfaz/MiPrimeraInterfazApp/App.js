import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Bienvenido a Mi App</Text>
      
      <Image
        source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
        style={styles.imagen}
      />
      
      <Text style={styles.descripcion}>
        Esta es una interfaz básica construida con View, Text e Image en React Native.
      </Text>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f8ff",
    justifyContent: "center",
    alignItems: "center",
    padding: 26,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f3c88",
    marginBottom: 20,
    textAlign: "center",
  },
  imagen: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  descripcion: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
});