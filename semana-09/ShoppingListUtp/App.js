import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';

export default function App() {
  const [currentTab, setCurrentTab] = useState('Home');
  const [isDark, setIsDark] = useState(false);

  // Al iniciar, leer la preferencia y aplicarla[cite: 22]
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const theme = await AsyncStorage.getItem('@prefs/theme');
        if (theme !== null) setIsDark(JSON.parse(theme));
      } catch (e) { console.error(e); }
    };
    loadTheme();
  }, []);

  // Alternar modo oscuro y guardar preferencia[cite: 21, 22]
  const toggleTheme = async (value) => {
    setIsDark(value);
    try {
      await AsyncStorage.setItem('@prefs/theme', JSON.stringify(value));
    } catch (e) { console.error(e); }
  };

  const bgStyle = isDark ? '#121212' : '#ffffff';
  const textStyle = isDark ? '#ffffff' : '#000000';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgStyle }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Navegación Simple[cite: 22] */}
      <View style={[styles.nav, { borderBottomColor: isDark ? '#333' : '#ccc' }]}>
        <TouchableOpacity onPress={() => setCurrentTab('Home')} style={styles.tab}>
          <Text style={{ fontSize: 18, fontWeight: currentTab === 'Home' ? 'bold' : 'normal', color: textStyle }}>Lista de Compras</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentTab('Settings')} style={styles.tab}>
          <Text style={{ fontSize: 18, fontWeight: currentTab === 'Settings' ? 'bold' : 'normal', color: textStyle }}>Ajustes</Text>
        </TouchableOpacity>
      </View>

      {/* Renderizado Condicional */}
      {currentTab === 'Home' ? (
        <HomeScreen isDark={isDark} />
      ) : (
        <SettingsScreen isDark={isDark} toggleTheme={toggleTheme} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },
  nav: { flexDirection: 'row', borderBottomWidth: 1, paddingBottom: 10 },
  tab: { flex: 1, alignItems: 'center' }
});