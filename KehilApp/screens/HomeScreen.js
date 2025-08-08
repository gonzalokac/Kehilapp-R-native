import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, ScrollView } from 'react-native';

export default function HomeScreen() {
  const [pregunta, setPregunta] = useState('');
  const [respuesta, setRespuesta] = useState('');

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>🕯 Próxima Festividad</Text>
        <Text>{proximaFestividad}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>🍽 Restaurantes Kosher Cercanos</Text>
        {restaurantes.map((r, i) => (
          <Text key={i}>• {r}</Text>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>📖 Eventos y Clases</Text>
        {eventos.map((e, i) => (
          <Text key={i}>• {e}</Text>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>🎬 Películas destacadas</Text>
        <FlatList
          data={peliculas}
          horizontal
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.movieCard}>
              <Text>{item}</Text>
            </View>
          )}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>📆 Calendario Hebreo</Text>
        {calendario.map((d, i) => (
          <Text key={i}>• {d}</Text>
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
        <Button title="Preguntar" onPress={responderPregunta} />
        <Text style={{ marginTop: 10 }}>{respuesta}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  card: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginTop: 10,
  },
  movieCard: {
    backgroundColor: '#fff',
    padding: 12,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    minWidth: 160,
    alignItems: 'center',
  },
});