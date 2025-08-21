import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [view, setView] = useState('login');
  const [form, setForm] = useState({
    login: '',
    password: '',
    nombre: '',
    email: '',
    telefono: ''
  });
  const navigation = useNavigation();

  // Usuario demo hardcodeado para funcionar sin servidor
  const demoUser = {
    id: 1,
    nombre: 'Usuario Demo',
    email: 'demo@kehilapp.com',
    password: '123456',
    telefono: '+54 11 1234-5678',
    fechaRegistro: new Date('2024-01-01')
  };

  const handleLogin = () => {
    if (!form.login || !form.password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    // Verificar credenciales del usuario demo
    if (form.login === demoUser.email && form.password === demoUser.password) {
      // Login exitoso - navegar a la pantalla principal
      navigation.navigate("Main", { user: demoUser });
    } else {
      Alert.alert("Error", "Credenciales incorrectas. Usa: demo@kehilapp.com / 123456");
    }
  };

  const handleRegister = () => {
    if (!form.nombre || !form.email || !form.password || !form.telefono) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    // Simular registro exitoso
    const newUser = {
      id: Date.now(),
      nombre: form.nombre,
      email: form.email,
      password: form.password,
      telefono: form.telefono,
      fechaRegistro: new Date()
    };

    Alert.alert("Éxito", "Usuario registrado ✅\n\nAhora puedes hacer login con tu cuenta", [
      {
        text: "OK",
        onPress: () => {
          setView("login");
          setForm({ login: form.email, password: form.password, nombre: '', email: '', telefono: '' });
        }
      }
    ]);
  };

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  if (view === 'register') {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>📝 Registro</Text>
        <Text style={styles.subtitle}>Únete a nuestra comunidad judía</Text>
        
        <Text style={styles.sectionTitle}>Información Personal</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre completo"
          value={form.nombre}
          onChangeText={(value) => updateForm('nombre', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={form.email}
          onChangeText={(value) => updateForm('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          value={form.telefono}
          onChangeText={(value) => updateForm('telefono', value)}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={form.password}
          onChangeText={(value) => updateForm('password', value)}
          secureTextEntry
        />
        
        <Button title="Registrarse" onPress={handleRegister} />
        
        <TouchableOpacity onPress={() => setView('login')} style={styles.linkButton}>
          <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🕯 KehilApp</Text>
      <Text style={styles.subtitle}>Tu comunidad judía en un solo lugar</Text>
      
      <Text style={styles.sectionTitle}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={form.login}
        onChangeText={(value) => updateForm('login', value)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={form.password}
        onChangeText={(value) => updateForm('password', value)}
        secureTextEntry
      />
      
      <Button title="Iniciar Sesión" onPress={handleLogin} />
      
      <View style={styles.demoInfo}>
        <Text style={styles.demoTitle}>👤 Usuario Demo:</Text>
        <Text style={styles.demoText}>Email: demo@kehilapp.com</Text>
        <Text style={styles.demoText}>Contraseña: 123456</Text>
      </View>
      
      <TouchableOpacity onPress={() => setView('register')} style={styles.linkButton}>
        <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
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
    color: '#6200ee',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    color: '#666',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    marginVertical: 16,
    fontWeight: '600',
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    marginVertical: 8,
    borderRadius: 8,
    fontSize: 16,
  },
  demoInfo: {
    backgroundColor: '#f0f8ff',
    padding: 16,
    borderRadius: 8,
    marginVertical: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#6200ee',
    alignSelf: 'stretch',
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 8,
  },
  demoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  linkButton: {
    marginTop: 20,
    padding: 10,
  },
  linkText: {
    color: '#6200ee',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});