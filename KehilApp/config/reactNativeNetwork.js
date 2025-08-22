import { Platform } from 'react-native';

// Configuración de red específica para React Native
export const NETWORK_CONFIG = {
  SERVER_PORT: 3001,
  REQUEST_TIMEOUT: 10000,
};

// URLs específicas por plataforma
const PLATFORM_URLS = {
  android: [
    'http://10.0.2.2:3001/api',      // Emulador Android
    'http://192.168.1.100:3001/api',  // IP común de red local
    'http://192.168.0.100:3001/api'   // IP alternativa
  ],
  ios: [
    'http://localhost:3001/api',       // Simulador iOS
    'http://127.0.0.1:3001/api'       // Localhost alternativo
  ],
  web: [
    'http://localhost:3001/api'        // Web
  ]
};

// Función para obtener URLs según la plataforma
export const getApiUrls = () => {
  const platform = Platform.OS;
  return PLATFORM_URLS[platform] || PLATFORM_URLS.web;
};

// Función para obtener la URL por defecto
export const getDefaultApiUrl = () => {
  const platform = Platform.OS;
  if (platform === 'android') {
    return 'http://10.0.2.2:3001/api';
  } else if (platform === 'ios') {
    return 'http://localhost:3001/api';
  } else {
    return 'http://localhost:3001/api';
  }
};

// Función para probar conexión a una URL
export const testConnection = async (url) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), NETWORK_CONFIG.REQUEST_TIMEOUT);
    
    const response = await fetch(`${url}/health`, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      console.log(`✅ Conexión exitosa a: ${url}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.log(`❌ Error conectando a ${url}:`, error.message);
    return false;
  }
};

// Función para obtener la mejor URL disponible
export const getBestApiUrl = async () => {
  try {
    const urls = getApiUrls();
    
    // Probar cada URL hasta encontrar una que funcione
    for (const url of urls) {
      if (await testConnection(url)) {
        return url;
      }
    }
    
    // Si ninguna funciona, retornar la URL por defecto
    console.log('⚠️ No se pudo conectar a ninguna URL, usando URL por defecto');
    return getDefaultApiUrl();
    
  } catch (error) {
    console.error('Error obteniendo URL de API:', error);
    return getDefaultApiUrl();
  }
};

// Fetch seguro con timeout y manejo de errores
export const safeFetch = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), NETWORK_CONFIG.REQUEST_TIMEOUT);
  
  try {
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
    
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Timeout de conexión - El servidor no responde');
    }
    
    if (error.message.includes('Network request failed')) {
      throw new Error('Error de red - Verifica tu conexión a internet');
    }
    
    throw error;
  }
};
