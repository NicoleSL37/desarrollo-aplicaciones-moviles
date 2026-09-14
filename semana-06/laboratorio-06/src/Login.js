import React, { useState, useEffect } from "react";
import { View, TextInput, Button, Alert } from "react-native";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleLogin = () => {
    Alert.alert("Bienvenido " + username);
    setSubmitted(true);
  };

  useEffect(() => {
    if (submitted) {
      setUsername("");
      setPassword("");
      setSubmitted(false);
    }
  }, [submitted]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TextInput
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8, width: "80%" }}
      />
      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8, width: "80%" }}
      />
      <Button title="Iniciar sesión" onPress={handleLogin} />
    </View>
  );
}