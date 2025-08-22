import { Platform } from 'react-native';

// Configuración específica para emulador Android
export const NETWORK_CONFIG = {
  SERVER_PORT: 3001,
  REQUEST_TIMEOUT: 20000, // Aumentado a 20 segundos
};

// Función para detectar emulador
const isEmulator = () => {
  // En desarrollo, asumimos que es emulador
  return __DEV__;
};

// Función para obtener la URL correcta según el entorno
export const getApiUrl = () => {
  if (Platform.OS === 'android') {
    if (isEmulator()) {
      // Para emulador Android, usar la IP de la PC en la red local
      // Primero intentar con localhost directo
      return 'http://localhost:3001/api';
    } else {
      // Para dispositivo físico, usar IP de red local
      return 'http://192.168.1.100:3001/api';
    }
  } else if (Platform.OS === 'ios') {
    if (isEmulator()) {
      // Para simulador iOS, usar localhost
      return 'http://localhost:3001/api';
    } else {
      // Para dispositivo físico iOS, usar IP de red local
      return 'http://192.168.1.100:3001/api';
    }
  } else {
    // Web: usar localhost
    return 'http://localhost:3001/api';
  }
};

// Función para probar conexión con múltiples URLs
export const testConnection = async (urls) => {
  for (const url of urls) {
    try {
      console.log(`🔍 Probando conexión a: ${url}`);
      
      const response = await fetch(`${url}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000
      });
      
      if (response.ok) {
        console.log(`✅ Conexión exitosa a: ${url}`);
        return url;
      }
    } catch (error) {
      console.log(`❌ Error conectando a ${url}:`, error.message);
      continue;
    }
  }
  
  throw new Error('No se pudo conectar a ninguna URL');
};

// Función para obtener la mejor URL disponible
export const getBestApiUrl = async () => {
  try {
    // Generar URLs para probar según la plataforma
    const urls = [];
    
    if (Platform.OS === 'android') {
      if (isEmulator()) {
        // Para emulador Android, probar estas URLs en orden
        urls.push('http://localhost:3001/api');
        urls.push('http://127.0.0.1:3001/api');
        urls.push('http://10.0.2.2:3001/api');
      } else {
        // Para dispositivo físico
        urls.push('http://192.168.1.100:3001/api');
        urls.push('http://192.168.0.100:3001/api');
      }
    } else if (Platform.OS === 'ios') {
      if (isEmulator()) {
        // Para simulador iOS
        urls.push('http://localhost:3001/api');
        urls.push('http://127.0.0.1:3001/api');
      } else {
        // Para dispositivo físico iOS
        urls.push('http://192.168.1.100:3001/api');
        urls.push('http://192.168.0.100:3001/api');
      }
    }
    
    // Probar cada URL
    const workingUrl = await testConnection(urls);
    return workingUrl;
    
  } catch (error) {
    console.error('Error obteniendo URL de API:', error);
    
    // Retornar URL por defecto según la plataforma
    if (Platform.OS === 'android') {
      return isEmulator() ? 'http://localhost:3001/api' : 'http://192.168.1.100:3001/api';
    } else if (Platform.OS === 'ios') {
      return isEmulator() ? 'http://localhost:3001/api' : 'http://192.168.1.100:3001/api';
    } else {
      return 'http://localhost:3001/api';
    }
  }
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
