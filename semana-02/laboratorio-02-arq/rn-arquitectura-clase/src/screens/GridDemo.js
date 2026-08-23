import { StyleSheet, Text, View } from 'react-native';

export default function GridDemo() {
    return (
        <View style={styles.container}>
            {Array.from({ length: 6 }).map((_, i) => (
                <View key={i} style={styles.box}>
                    <Text style={styles.boxText}>#{i + 1}</Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',        // permite múltiples filas[cite: 3]
        gap: 8,                  // si tu versión no soporta gap, usa "margin"[cite: 3]
        padding: 12,
        justifyContent: 'space-between',
    },
    box: {
        width: '48%',            // porcentaje válido[cite: 3]
        aspectRatio: 1,          // cuadrado sin especificar alto[cite: 3]
        backgroundColor: '#22C55E',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    boxText: { color: '#fff', fontWeight: '700' },
});