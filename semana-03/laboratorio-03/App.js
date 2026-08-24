import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfileCard } from "./src/components/ProfileCard";
import PerfilUsuario from "./src/components/PerfilUsuario";

export default function App() {
  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <ProfileCard
            name="Ana Beltrán"
            age={22}
            photo={{ uri: 'https://picsum.photos/300' }}
          />
          <ProfileCard
            name="Luis García"
            age={28}
            photo={{ uri: 'https://picsum.photos/301' }}
          />
          <PerfilUsuario nombre="Juan Pérez" edad={28} />
          <PerfilUsuario nombre="Ana López" edad={34} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, height: '100vh', width: '100vw' },
  container: { flex: 1, backgroundColor: "#f4f6f8" },
  scroll: { padding: 16, gap: 12 },
});