import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ItemRow({ item, onToggle, onRemove }) {
  return (
    <View style={styles.row}>
      <TouchableOpacity onPress={() => onToggle(item.id)} style={styles.info}>
        <Text style={[styles.title, item.done && styles.done]}>
          {item.title} {item.quantity ? `(x${item.quantity})` : ''}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onRemove(item.id)} style={styles.deleteBtn}>
        <Text style={styles.deleteText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderColor: '#eee', alignItems: 'center' },
  info: { flex: 1 },
  title: { fontSize: 16 },
  done: { textDecorationLine: 'line-through', color: '#999' },
  deleteBtn: { backgroundColor: '#ff5252', padding: 8, borderRadius: 5 },
  deleteText: { color: 'white', fontWeight: 'bold' }
});