import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen({ route }) {
  const [pregunta, setPregunta] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const navigation = useNavigation();
  
  // Obtener el usuario de los parámetros de la ruta
  const user = route?.params?.user || {};

  const proximaFestividad = 'Shavuot - 11 de junio';
  const restaurantes = ['Sabra Grill', 'Deli Kosher', 'Benei Pizza'];
  const eventos = ['Clase de Torá - Lunes', 'Taller de Janucá - Miércoles'];
  const peliculas = ['El violinista en el tejado', 'La lista de Schindler', 'Unorthodox'];
  const calendario = ['1 Tamuz - Ayuno', '10 Tamuz - Shabat Gadol'];

  const responderPregunta = () => {
    if (pregunta.toLowerCase().includes('iosef')) {
      setRespuesta('La historia de Iosef está en Bereshit (Génesis) capítulos 37 al 50.');
    } else {
      setRespuesta('Consultá con tu rabino o buscá en Sefaria.org 📚');
    }
  };

  const navigateToProfile = () => {
    navigation.navigate('User', { user });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header con icono de perfil */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🕯 KehilApp</Text>
        <TouchableOpacity onPress={navigateToProfile} style={styles.profileButton}>
          <Ionicons name="person-circle" size={32} color="#6200ee" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeText}>
            ¡Bienvenido{user?.nombre ? `, ${user.nombre}` : ''}! 👋
          </Text>
          <Text style={styles.welcomeSubtext}>
            Tu comunidad judía en un solo lugar
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>🕯 Próxima Festividad</Text>
          <Text style={styles.cardText}>{proximaFestividad}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>🍽 Restaurantes Kosher Cercanos</Text>
          {restaurantes.map((r, i) => (
            <Text key={i} style={styles.cardText}>• {r}</Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>📖 Eventos y Clases</Text>
          {eventos.map((e, i) => (
            <Text key={i} style={styles.cardText}>• {e}</Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>🎬 Películas destacadas</Text>
          <FlatList
            data={peliculas}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.movieCard}>
                <Text style={styles.movieText}>{item}</Text>
              </View>
            )}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>📆 Calendario Hebreo</Text>
          {calendario.map((d, i) => (
            <Text key={i} style={styles.cardText}>• {d}</Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>💬 Centro de Consultas Judías</Text>
          <TextInput
            style={styles.input}
            placeholder="¿Dónde está la historia de Iosef?"
            value={pregunta}
            onChangeText={setPregunta}
          />
          <TouchableOpacity style={styles.askButton} onPress={responderPregunta}>
            <Text style={styles.askButtonText}>Preguntar</Text>
          </TouchableOpacity>
          {respuesta ? (
            <Text style={styles.answerText}>{respuesta}</Text>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  profileButton: {
    padding: 5,
  },
  scrollContainer: {
    padding: 16,
  },
  welcomeCard: {
    backgroundColor: '#6200ee',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  welcomeSubtext: {
    fontSize: 14,
    color: '#e8e4ff',
    textAlign: 'center',
  },
  card: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  cardText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
    lineHeight: 22,
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  askButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  askButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  answerText: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
    borderLeftWidth: 4,
    borderLeftColor: '#6200ee',
  },
  movieCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    marginRight: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    minWidth: 160,
    alignItems: 'center',
    elevation: 2,
  },
  movieText: {
    fontSize: 14,
    color: '#495057',
    textAlign: 'center',
    fontWeight: '500',
  },
});