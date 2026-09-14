import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Temporizador from './src/Temporizador';
import Login from './src/Login';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Temporizador />
      </View>
      
      <View style={styles.separator} />

      <View style={styles.section}>
        <Login />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5', marginTop: 40 },
  section: { flex: 1, justifyContent: 'center' },
  separator: { height: 2, backgroundColor: '#ccc', marginVertical: 20 }
});