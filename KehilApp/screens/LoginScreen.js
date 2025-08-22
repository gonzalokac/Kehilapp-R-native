import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Platform, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración de la API según la plataforma
const getApiUrl = () => {
  if (Platform.OS === 'android') {
    // Para emulador Android usar 10.0.2.2, para dispositivo físico usar IP de tu PC
    return 'http://10.0.2.2:3001/api';
  } else if (Platform.OS === 'ios') {
    // Para simulador iOS usar localhost, para dispositivo físico usar IP de tu PC
    return 'http://localhost:3001/api';
  } else {
    return 'http://localhost:3001/api';   // Web
  }
};

const API_BASE_URL = getApiUrl();

export default function LoginScreen() {
  const [view, setView] = useState('login');
  const [loading, setLoading] = useState(false);
  const [useServer, setUseServer] = useState(false);
  const [form, setForm] = useState({
    login: '',
    password: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    esEmpresa: false
  });
  const navigation = useNavigation();

  // Verificar si hay conexión al servidor
  useEffect(() => {
    checkServerConnection();
  }, []);

  const checkServerConnection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (response.ok) {
        setUseServer(true);
        console.log('✅ Servidor conectado');
      }
    } catch (error) {
      setUseServer(false);
      console.log('⚠️ Servidor no disponible, usando modo local');
      // No mostrar alertas de error al usuario
    }
  };

  const handleLogin = async () => {
    if (!form.login || !form.password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    
    try {
      if (useServer) {
        // Login con servidor
        const response = await fetch(`${API_BASE_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: form.login,
            password: form.password
          })
        });

        const data = await response.json();

        if (data.success) {
          navigation.navigate("Main", { user: data.user });
        } else {
          Alert.alert("Error", data.message || "Credenciales incorrectas");
        }
      } else {
        // Login local
        const users = await getLocalUsers();
        const user = users.find(u => u.email === form.login && u.password === form.password);
        
        if (user) {
          navigation.navigate("Main", { user: user });
        } else {
          Alert.alert("Error", "Credenciales incorrectas");
        }
      }
    } catch (error) {
      console.error('Error en login:', error);
      if (useServer) {
        Alert.alert("Error", "Error de conexión. Verifica que el servidor esté funcionando.");
      } else {
        Alert.alert("Error", "Error interno de la aplicación.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!form.nombre || !form.apellido || !form.email || !form.password || !form.telefono) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    
    try {
      if (useServer) {
        // Registro con servidor
        const response = await fetch(`${API_BASE_URL}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre: form.nombre,
            apellido: form.apellido,
            email: form.email,
            password: form.password,
            telefono: form.telefono,
            esEmpresa: form.esEmpresa
          })
        });

        const data = await response.json();

        if (data.success) {
          // Crear usuario local también para consistencia
          const newUser = {
            id: Date.now().toString(),
            nombre: form.nombre,
            apellido: form.apellido,
            email: form.email,
            password: form.password,
            telefono: form.telefono,
            esEmpresa: form.esEmpresa,
            verificado: form.esEmpresa,
            fechaRegistro: new Date().toISOString()
          };
          
          // Ir directo a Home con el usuario registrado
          navigation.navigate("Main", { user: newUser });
        } else {
          // Si falla el servidor, usar modo local
          console.log('Servidor falló, usando modo local');
          await handleLocalRegister();
        }
      } else {
        // Registro local
        await handleLocalRegister();
      }
    } catch (error) {
      console.error('Error en registro:', error);
      // Si hay error de servidor, usar modo local silenciosamente
      if (useServer) {
        console.log('Error de servidor, usando modo local');
        await handleLocalRegister();
      } else {
        Alert.alert("Error", "Error interno de la aplicación.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Función auxiliar para registro local
  const handleLocalRegister = async () => {
    const newUser = {
      id: Date.now().toString(),
      nombre: form.nombre,
      apellido: form.apellido,
      email: form.email,
      password: form.password,
      telefono: form.telefono,
      esEmpresa: form.esEmpresa,
      verificado: form.esEmpresa, // Si es empresa, automáticamente verificado
      fechaRegistro: new Date().toISOString()
    };

    // Log para debug - verificar que el usuario se cree correctamente
    console.log('LoginScreen - Usuario creado:', newUser);
    console.log('LoginScreen - EsEmpresa:', newUser.esEmpresa);
    console.log('LoginScreen - Verificado:', newUser.verificado);

    await saveLocalUser(newUser);
    
    // Ir directo a Home con el usuario registrado
    navigation.navigate("Main", { user: newUser });
  };

  // Funciones para almacenamiento local simple
  const saveLocalUser = async (user) => {
    try {
      const users = await getLocalUsers();
      users.push(user);
      await AsyncStorage.setItem('kehilapp_users', JSON.stringify(users));
      console.log('Usuario guardado localmente:', user.email);
    } catch (error) {
      console.error('Error guardando usuario local:', error);
    }
  };

  const getLocalUsers = async () => {
    try {
      const users = await AsyncStorage.getItem('kehilapp_users');
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error obteniendo usuarios locales:', error);
      return [];
    }
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
          placeholder="Nombre"
          value={form.nombre}
          onChangeText={(value) => updateForm('nombre', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Apellido"
          value={form.apellido}
          onChangeText={(value) => updateForm('apellido', value)}
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
        
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>¿Eres una empresa?</Text>
          <Switch
            value={form.esEmpresa}
            onValueChange={(value) => updateForm('esEmpresa', value)}
            trackColor={{ false: '#767577', true: '#6200ee' }}
            thumbColor={form.esEmpresa ? '#f4f3f4' : '#f4f3f4'}
          />
        </View>
        
        {form.esEmpresa && (
          <View style={styles.verifiedInfo}>
            <Text style={styles.verifiedText}>✅ Tu cuenta será verificada automáticamente</Text>
          </View>
        )}
        
        <Button 
          title={loading ? "Registrando..." : "Registrarse"} 
          onPress={handleRegister}
          disabled={loading}
        />
        
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#6200ee" />
            <Text style={styles.loadingText}>Registrando usuario...</Text>
          </View>
        )}
        
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
      
      <Button 
        title={loading ? "Iniciando..." : "Iniciar Sesión"} 
        onPress={handleLogin}
        disabled={loading}
      />
      
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#6200ee" />
          <Text style={styles.loadingText}>Verificando credenciales...</Text>
        </View>
      )}
      
      <View style={styles.info}>
        <Text style={styles.infoTitle}>ℹ️ Información:</Text>
        <Text style={styles.infoText}>
          {useServer ? 'Conectado a la base de datos SQL Server' : 'Modo local - Sin servidor'}
        </Text>
        <Text style={styles.infoText}>
          {useServer ? 'Los usuarios se guardan y verifican automáticamente' : 'Los usuarios se guardan localmente'}
        </Text>
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
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 16,
    paddingHorizontal: 10,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  verifiedInfo: {
    backgroundColor: '#e8f5e8',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
    alignSelf: 'stretch',
  },
  verifiedText: {
    fontSize: 14,
    color: '#2e7d32',
    fontWeight: '500',
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
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
  },
  loadingText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  info: {
    backgroundColor: '#e0f2f7',
    padding: 16,
    borderRadius: 8,
    marginVertical: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
    alignSelf: 'stretch',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
});