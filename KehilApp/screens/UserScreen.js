import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function UserScreen({ route }) {
  const navigation = useNavigation();
  const { user } = route.params || {};

  // Log para debug - verificar que los datos lleguen
  console.log('UserScreen - Datos recibidos:', user);
  console.log('UserScreen - Verificado:', user?.verificado);
  console.log('UserScreen - EsEmpresa:', user?.esEmpresa);

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Cerrar Sesión",
          style: "destructive",
          onPress: () => navigation.navigate('Login')
        }
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert("Editar Perfil", "Función en desarrollo");
  };

  const handleSettings = () => {
    Alert.alert("Configuración", "Función en desarrollo");
  };

  const handleHelp = () => {
    Alert.alert("Ayuda", "Función en desarrollo");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header con botón de regreso */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#6200ee" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>👤 Perfil de Usuario</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header del perfil */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={80} color="#6200ee" />
            {/* Badge de verificación */}
            {user?.verificado && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={24} color="#4caf50" />
              </View>
            )}
          </View>
          <Text style={styles.userName}>
            {user?.nombre || 'Usuario'} {user?.apellido || ''}
          </Text>
          <Text style={styles.userEmail}>
            {user?.email || 'usuario@ejemplo.com'}
          </Text>
          
          {/* Estado de verificación y empresa - Más visible */}
          <View style={styles.statusContainer}>
            {user?.verificado ? (
              <View style={styles.verificationStatus}>
                <Ionicons name="shield-checkmark" size={20} color="#4caf50" />
                <Text style={styles.verificationText}>✅ Cuenta Verificada</Text>
              </View>
            ) : (
              <View style={styles.notVerifiedStatus}>
                <Ionicons name="shield-outline" size={20} color="#ff9800" />
                <Text style={styles.notVerifiedText}>⚠️ Cuenta No Verificada</Text>
              </View>
            )}
            
            {user?.esEmpresa && (
              <View style={styles.companyBadge}>
                <Ionicons name="business" size={20} color="#2196f3" />
                <Text style={styles.companyText}>🏢 Empresa</Text>
              </View>
            )}
          </View>
        </View>

        {/* Información del usuario */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>📋 Información Personal</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>Nombre:</Text>
            <Text style={styles.infoValue}>
              {user?.nombre || 'No especificado'}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>
              {user?.email || 'No especificado'}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>Teléfono:</Text>
            <Text style={styles.infoValue}>
              {user?.telefono || 'No especificado'}
            </Text>
          </View>
          
          {user?.fechaRegistro && (
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <Text style={styles.infoLabel}>Registrado:</Text>
              <Text style={styles.infoValue}>
                {new Date(user.fechaRegistro).toLocaleDateString('es-ES')}
              </Text>
            </View>
          )}
          
          <View style={styles.infoRow}>
            <Ionicons name="business-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>Tipo de Cuenta:</Text>
            <Text style={styles.infoValue}>
              {user?.esEmpresa ? '🏢 Empresa' : '👤 Usuario Individual'}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="shield-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>Estado:</Text>
            <Text style={styles.infoValue}>
              {user?.verificado ? '✅ Verificado' : '⚠️ No Verificado'}
            </Text>
          </View>
        </View>

        {/* Acciones rápidas */}
        <View style={styles.actionsCard}>
          <Text style={styles.sectionTitle}>⚙️ Acciones</Text>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleEditProfile}>
            <Ionicons name="create-outline" size={24} color="#6200ee" />
            <Text style={styles.actionText}>Editar Perfil</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleSettings}>
            <Ionicons name="settings-outline" size={24} color="#6200ee" />
            <Text style={styles.actionText}>Configuración</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleHelp}>
            <Ionicons name="help-circle-outline" size={24} color="#6200ee" />
            <Text style={styles.actionText}>Ayuda</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Botón de logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 24,
  },
  scrollContainer: {
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
  },
  avatarContainer: {
    marginBottom: 15,
    position: 'relative',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 2,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  verificationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
  },
  notVerifiedStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
  },
  verificationText: {
    fontSize: 14,
    color: '#2e7d32',
    fontWeight: '600',
    marginLeft: 6,
  },
  notVerifiedText: {
    fontSize: 14,
    color: '#ff9800',
    fontWeight: '600',
    marginLeft: 6,
  },
  companyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  companyText: {
    fontSize: 14,
    color: '#1565c0',
    fontWeight: '600',
    marginLeft: 6,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
    marginRight: 15,
    minWidth: 80,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    fontWeight: '500',
  },
  actionsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
    flex: 1,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    elevation: 3,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});
