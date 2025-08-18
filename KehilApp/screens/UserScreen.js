import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function UserScreen({ route }) {
  const { user } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Perfil de Usuario</Text>
      <Text>Nombre: {user.Nombre}</Text>
      <Text>Email: {user.Email}</Text>
      <Text>Teléfono: {user.Telefono}</Text>
      <Text>Registrado el: {new Date(user.FechaRegistro).toLocaleDateString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 }
});
