import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

export default function UserCard({ name, age, photo, role }) {
    return (
        <View style={styles.card}>
            <Image source={{ uri: photo }} style={styles.image} resizeMode="cover" />
            <View style={styles.info}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.age}>Edad: {age}</Text>
                {role ? <Text style={styles.role}>{role}</Text> : null}
            </View>
        </View>
    );
}

UserCard.propTypes = {
    name: PropTypes.string.isRequired,
    age: PropTypes.number.isRequired,
    photo: PropTypes.string.isRequired,
    role: PropTypes.string,
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 120, // Tamaño fijo arriba requerido
    },
    info: {
        padding: 12,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold', // Negrita y más grande
        color: '#333',
    },
    age: {
        fontSize: 14,
        color: 'green', // Color verde[cite: 4]
        fontWeight: '600',
        marginVertical: 4,
    },
    role: {
        fontSize: 12,
        color: '#666', // Gris y tamaño más pequeño[cite: 4]
    },
});