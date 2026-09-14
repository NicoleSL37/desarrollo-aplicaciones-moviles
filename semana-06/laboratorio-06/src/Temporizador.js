import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";

export default function Temporizador() {
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    if (timeLeft === 0) return;
    
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    
    return () => clearInterval(timerId);
  }, [timeLeft]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24 }}>
        {timeLeft > 0 ? `Tiempo restante: ${timeLeft}` : "¡Tiempo terminado!"}
      </Text>
    </View>
  );
}