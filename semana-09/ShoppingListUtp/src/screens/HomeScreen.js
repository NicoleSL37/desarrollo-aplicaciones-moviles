import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ItemRow from '../components/ItemRow';

export default function HomeScreen({ isDark }) {
  const [list, setList] = useState([]);
  const [item, setItem] = useState('');
  const [qty, setQty] = useState('');

  // Efecto de carga inicial
  useEffect(() => {
    const loadData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('shoppingList');
        if (jsonValue != null) setList(JSON.parse(jsonValue));
      } catch (e) { console.error(e); }
    };
    loadData();
  }, []);

  // Efecto de guardado por cambios[cite: 21, 22]
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('shoppingList', JSON.stringify(list));
      } catch (e) { console.error(e); }
    };
    saveData();
  }, [list]);

  // Agregar producto con validación[cite: 21, 22]
  const addItem = () => {
    if (item.trim() === '') {
      Alert.alert('Error', 'Ingrese un producto');
      return;
    }
    const newItem = { id: Date.now().toString(), title: item, quantity: qty, done: false };
    setList([...list, newItem]);
    setItem('');
    setQty('');
  };

  const toggleItem = (id) => {
    setList(list.map(li => li.id === id ? { ...li, done: !li.done } : li));
  };

  const removeItem = (id) => {
    setList(list.filter(li => li.id !== id));
  };

  // Botón "Borrar todo" con confirmación[cite: 21, 22]
  const clearAll = () => {
    Alert.alert('Confirmación', '¿Borrar toda la lista?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Borrar', style: 'destructive', onPress: async () => {
          await AsyncStorage.removeItem('shoppingList');
          setList([]);
        } 
      }
    ]);
  };

  const comprados = list.filter(i => i.done).length;
  const pendientes = list.length - comprados;
  const textColor = isDark ? '#fff' : '#000';

  return (
    <View style={styles.container}>
      <TextInput placeholder="Producto" value={item} onChangeText={setItem} style={[styles.input, isDark && styles.darkInput]} placeholderTextColor="#999" />
      <TextInput placeholder="Cantidad (opcional)" value={qty} onChangeText={setQty} keyboardType="numeric" style={[styles.input, isDark && styles.darkInput]} placeholderTextColor="#999" />
      <Button title="Agregar" onPress={addItem} />

      {/* Renderizado de listas con FlatList[cite: 21, 22] */}
      <FlatList
        data={list}
        keyExtractor={i => i.id}
        renderItem={({ item }) => <ItemRow item={item} onToggle={toggleItem} onRemove={removeItem} />}
        style={{ marginTop: 10 }}
      />

      {/* Contadores[cite: 21, 22] */}
      <View style={styles.stats}>
        <Text style={{ color: textColor }}>Total: {list.length} | Pendientes: {pendientes} | Comprados: {comprados}</Text>
      </View>
      <Button title="Borrar todo" color="red" onPress={clearAll} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5, color: '#000' },
  darkInput: { borderColor: '#555', color: '#fff', backgroundColor: '#333' },
  stats: { paddingVertical: 15, alignItems: 'center' }
});