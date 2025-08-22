import { Platform } from 'react-native';

// Configuración inteligente de red para KehilApp
export const NETWORK_CONFIG = {
  SERVER_PORT: 3001,
  REQUEST_TIMEOUT: 15000,
};

// Función para detectar si estamos en emulador
const isEmulator = () => {
  // En desarrollo, asumimos que es emulador
  return __DEV__;
};

// Función para obtener la IP local de la PC
const getLocalIP = () => {
  // IPs comunes de red local
  const commonIPs = [
    '192.168.1.100',
    '192.168.1.101',
    '192.168.0.100',
    '192.168.0.101',
    '10.0.2.2',      // Emulador Android
    '10.0.3.2',      // Genymotion
  ];
  
  return commonIPs[0]; // Usar la primera IP común
};

// Función inteligente para obtener la URL de la API
export const getApiUrl = () => {
  if (Platform.OS === 'android') {
    if (isEmulator()) {
      // Emulador Android: usar 10.0.2.2 (localhost de la PC)
      return 'http://10.0.2.2:3001/api';
    } else {
      // Dispositivo físico: usar IP de red local
      const localIP = getLocalIP();
      return `http://${localIP}:3001/api`;
    }
  } else if (Platform.OS === 'ios') {
    if (isEmulator()) {
      // Simulador iOS: usar localhost
      return 'http://localhost:3001/api';
    } else {
      // Dispositivo físico iOS: usar IP de red local
      const localIP = getLocalIP();
      return `http://${localIP}:3001/api`;
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
        timeout: 10000
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
    // Generar múltiples URLs para probar
    const urls = [];
    
    if (Platform.OS === 'android') {
      if (isEmulator()) {
        urls.push('http://10.0.2.2:3001/api');
        urls.push('http://localhost:3001/api');
      } else {
        urls.push(`http://${getLocalIP()}:3001/api`);
        urls.push('http://10.0.2.2:3001/api');
      }
    } else if (Platform.OS === 'ios') {
      if (isEmulator()) {
        urls.push('http://localhost:3001/api');
        urls.push('http://127.0.0.1:3001/api');
      } else {
        urls.push(`http://${getLocalIP()}:3001/api`);
        urls.push('http://localhost:3001/api');
      }
    }
    
    // Probar cada URL
    const workingUrl = await testConnection(urls);
    return workingUrl;
    
  } catch (error) {
    console.error('Error obteniendo URL de API:', error);
    
    // Retornar URL por defecto según la plataforma
    if (Platform.OS === 'android') {
      return isEmulator() ? 'http://10.0.2.2:3001/api' : `http://${getLocalIP()}:3001/api`;
    } else if (Platform.OS === 'ios') {
      return isEmulator() ? 'http://localhost:3001/api' : `http://${getLocalIP()}:3001/api`;
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
