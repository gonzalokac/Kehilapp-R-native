import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [view, setView] = useState('inicio');
  const [form, setForm] = useState({});
  const navigation = useNavigation();

const handleLogin = async () => {
  const res = await fetch("http://localhost:3001/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: form.login, password: form.password })
  });
  const data = await res.json();
  if (data.success) {
    navigation.navigate("Main", { user: data.user });
  } else {
    alert("Credenciales incorrectas");
  }
};

const handleRegister = async () => {
  const res = await fetch("http://localhost:3001/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form)
  });
  const data = await res.json();
  if (data.success) {
    alert("Usuario registrado ✅");
    setView("login");
  } else {
    alert("Error al registrar");
  }
};
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 20,
    marginVertical: 16,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    marginVertical: 8,
    borderRadius: 6,
  },
});