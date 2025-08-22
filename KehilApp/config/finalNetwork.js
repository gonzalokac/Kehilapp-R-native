import { Platform } from 'react-native';

// Configuración final de red para KehilApp
export const NETWORK_CONFIG = {
  SERVER_PORT: 3001,
  REQUEST_TIMEOUT: 15000, // Aumentado a 15 segundos
};

// Función simple para obtener la URL de la API
export const getApiUrl = () => {
  if (Platform.OS === 'android') {
    // Para emulador Android, usar 10.0.2.2 (localhost de la PC)
    // Para dispositivo físico, usar la IP de tu PC en la red local
    return 'http://10.0.2.2:3001/api';
  } else if (Platform.OS === 'ios') {
    return 'http://localhost:3001/api';
  } else {
    return 'http://localhost:3001/api';
  }
};

// Función para probar conexión con mejor manejo de errores
export const testConnection = async (url) => {
  try {
    console.log(`🔍 Probando conexión a: ${url}`);
    
    const response = await fetch(`${url}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });
    
    if (response.ok) {
      console.log(`✅ Conexión exitosa a: ${url}`);
      return true;
    } else {
      console.log(`⚠️ Respuesta no exitosa: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error conectando a ${url}:`, error.message);
    
    // Log específico para debugging
    if (error.message.includes('Network request failed')) {
      console.log('🔧 Error de red: Verifica que el servidor esté corriendo en puerto 3001');
    }
    
    return false;
  }
};

// Función para obtener la mejor URL disponible
export const getBestApiUrl = async () => {
  const url = getApiUrl();
  console.log(`🎯 Intentando conectar a: ${url}`);
  
  if (await testConnection(url)) {
    return url;
  }
  
  // Si falla, retornar la URL por defecto pero logear el error
  console.log('⚠️ No se pudo conectar, usando URL por defecto');
  console.log('💡 Verifica que:');
  console.log('   1. El servidor esté corriendo: node start-server.js');
  console.log('   2. El puerto 3001 esté libre');
  console.log('   3. No haya firewall bloqueando');
  
  return url;
};

// Fetch seguro con timeout y mejor manejo de errores
export const safeFetch = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), NETWORK_CONFIG.REQUEST_TIMEOUT);
  
  try {
    console.log(`📤 Enviando request a: ${url}`);
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    console.log(`✅ Request exitoso a: ${url}`);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      console.log('⏰ Timeout de conexión - El servidor no responde');
      throw new Error('Timeout de conexión - El servidor no responde');
    }
    
    if (error.message.includes('Network request failed')) {
      console.log('🌐 Error de red - Verifica la conexión al servidor');
      throw new Error('Error de red - Verifica que el servidor esté funcionando en puerto 3001');
    }
    
    console.log('❌ Error en fetch:', error.message);
    throw error;
  }
};
