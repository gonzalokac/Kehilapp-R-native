import { Platform } from 'react-native';

// Configuración de red específica para React Native
export const NETWORK_CONFIG_CLIENT = {
  // Puerto del servidor
  SERVER_PORT: 3001,
  
  // Timeouts para evitar errores de red
  REQUEST_TIMEOUT: 10000, // 10 segundos
  CONNECTION_TIMEOUT: 5000, // 5 segundos
};

// Función para obtener la URL de la API según la plataforma
export const getApiUrlClient = async () => {
  const platform = Platform.OS;
  
  // URLs específicas por plataforma
  const platformUrls = {
    android: [
      'http://10.0.2.2:3001/api',  // Emulador Android
      'http://192.168.1.100:3001/api', // IP común de red local
      'http://192.168.0.100:3001/api'  // IP alternativa
    ],
    ios: [
      'http://localhost:3001/api',   // Simulador iOS
      'http://127.0.0.1:3001/api'   // Localhost alternativo
    ],
    web: [
      'http://localhost:3001/api'    // Web
    ]
  };

  return platformUrls[platform] || platformUrls.web;
};

// Función para probar conexión a múltiples URLs
export const testConnectionClient = async (urls) => {
  for (const url of urls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), NETWORK_CONFIG_CLIENT.REQUEST_TIMEOUT);
      
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
        return url;
      }
    } catch (error) {
      console.log(`❌ Error conectando a ${url}:`, error.message);
      continue;
    }
  }
  
  throw new Error('No se pudo conectar a ningún servidor');
};

// Función para obtener la mejor URL disponible
export const getBestApiUrlClient = async () => {
  try {
    const urls = await getApiUrlClient();
    const workingUrl = await testConnectionClient(urls);
    return workingUrl;
  } catch (error) {
    console.error('Error obteniendo URL de API:', error);
    // Retornar URL por defecto según la plataforma
    return Platform.OS === 'android' ? 'http://10.0.2.2:3001/api' : 'http://localhost:3001/api';
  }
};

// Configuración de fetch con manejo de errores para cliente
export const safeFetchClient = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), NETWORK_CONFIG_CLIENT.REQUEST_TIMEOUT);
  
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
