import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [view, setView] = useState('inicio');
  const [form, setForm] = useState({});
  const navigation = useNavigation();

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const FormInput = ({ placeholder, secure, field }) => (
    <TextInput
      placeholder={placeholder}
      secureTextEntry={secure}
      style={styles.input}
      value={form[field] || ''}
      onChangeText={(text) => handleChange(field, text)}
    />
  );

  const handleLogin = () => {
    navigation.navigate('Main');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>KehilApp</Text>
      <Text style={styles.subtitle}>Tu conexión con el mundo judío</Text>

      {view === 'inicio' && (
        <>
          <Text style={styles.sectionTitle}>¿Cómo querés ingresar?</Text>
          <Button title="🔐 Iniciar Sesión" onPress={() => setView('login')} />
          <Button title="📝 Registrarse" onPress={() => setView('registro')} />
        </>
      )}

      {view === 'login' && (
        <>
          <Text style={styles.sectionTitle}>🔐 Iniciar Sesión</Text>
          <FormInput placeholder="Email o Teléfono" field="login" />
          <FormInput placeholder="Contraseña" secure field="password" />
          <Button title="Ingresar" onPress={handleLogin} />
          <Button title="⬅ Volver" onPress={() => setView('inicio')} />
        </>
      )}

      {view === 'registro' && (
        <>
          <Text style={styles.sectionTitle}>🙋 Registro de Usuario</Text>
          <FormInput placeholder="Nombre" field="nombre" />
          <FormInput placeholder="Email" field="email" />
          <FormInput placeholder="Teléfono" field="telefono" />
          <FormInput placeholder="Contraseña" secure field="password" />
          <Button title="Registrarse" onPress={handleLogin} />
          <Button title="⬅ Volver" onPress={() => setView('inicio')} />
        </>
      )}
    </ScrollView>
  );
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