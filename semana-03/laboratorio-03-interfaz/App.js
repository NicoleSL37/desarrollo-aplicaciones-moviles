import React from 'react';
import { ScrollView, StyleSheet, View, useWindowDimensions, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import UserCard from './src/components/UserCard';

export default function App() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 600;

  const usuarios = [
    { id: '1', name: 'Ana Pérez', age: 22, photo: 'https://picsum.photos/300', role: 'Desarrolladora' },
    { id: '2', name: 'Carlos Gómez', age: 25, photo: 'https://picsum.photos/301', role: 'Diseñador' },
    { id: '3', name: 'María López', age: 28, photo: 'https://picsum.photos/302', role: 'Analista' },
    { id: '4', name: 'José Torres', age: 30, photo: 'https://picsum.photos/303' }, // Sin rol opcional
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>Directorio de Usuarios</Text>
        <View style={[styles.grid, isLargeScreen && styles.gridLarge]}>
          {usuarios.map((user) => (
            <View 
              key={user.id} 
              style={[styles.cardContainer, { width: isLargeScreen ? '48%' : '100%' }]}
            >
              <UserCard
                name={user.name}
                age={user.age}
                photo={user.photo}
                role={user.role}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scroll: {
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  grid: {
    flexDirection: 'column',
  },
  gridLarge: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardContainer: {
    marginBottom: 16,
  },
});