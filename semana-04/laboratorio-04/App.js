import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';

export default function App() {
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');

  const manejarRegistro = () => {
    if (nombre.trim() === '') {
      setMensaje('Por favor, ingrese su nombre');
      return;
    }
    setMensaje(`Hola, ${nombre}. Registro correcto.`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registro básico</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Ingrese su nombre"
        value={nombre}
        onChangeText={setNombre}
      />

      <Button title="Enviar" onPress={manejarRegistro} />

      <TouchableOpacity 
        style={styles.botonSecundario} 
        onPress={() => setMensaje('Botón alternativo presionado')}
      >
        <Text style={styles.textoBoton}>Usar TouchableOpacity</Text>
      </TouchableOpacity>

      {mensaje !== '' && <Text style={styles.resultado}>{mensaje}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
  },
  botonSecundario: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  textoBoton: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resultado: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
  },
});