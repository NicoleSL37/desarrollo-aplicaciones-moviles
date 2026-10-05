import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

export default function SettingsScreen({ isDark, toggleTheme }) {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, isDark && { color: '#fff' }]}>Activar Modo Oscuro</Text>
      <Switch value={isDark} onValueChange={toggleTheme} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'flex-start' },
  text: { fontSize: 18, color: '#000' }
});