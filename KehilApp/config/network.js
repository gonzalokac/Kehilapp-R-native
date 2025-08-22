// Configuración de red mejorada para evitar TypeErrors
// Funciona tanto en React Native como en Node.js

// Detectar el entorno
const isReactNative = typeof navigator === 'undefined' && typeof global !== 'undefined';
const isWeb = typeof window !== 'undefined';
const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;

// Configuración de red
export const NETWORK_CONFIG = {
  // Puerto del servidor
  SERVER_PORT: 3001,
  
  // Timeouts para evitar errores de red
  REQUEST_TIMEOUT: 10000, // 10 segundos
  CONNECTION_TIMEOUT: 5000, // 5 segundos
};

// Función para obtener la plataforma
const getPlatform = () => {
  if (isNode) return 'node';
  if (isWeb) return 'web';
  if (isReactNative) return 'android'; // Por defecto para React Native
  return 'unknown';
};

// Función para obtener la URL de la API según la plataforma
export const getApiUrl = async () => {
  const platform = getPlatform();
  
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
    ],
    node: [
      'http://localhost:3001/api'    // Node.js
    ]
  };

  return platformUrls[platform] || platformUrls.web;
};

// Función para probar conexión a múltiples URLs
export const testConnection = async (urls) => {
  for (const url of urls) {
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
export const getBestApiUrl = async () => {
  try {
    const urls = await getApiUrl();
    const workingUrl = await testConnection(urls);
    return workingUrl;
  } catch (error) {
    console.error('Error obteniendo URL de API:', error);
    // Retornar URL por defecto según la plataforma
    const platform = getPlatform();
    if (platform === 'android') {
      return 'http://10.0.2.2:3001/api';
    } else {
      return 'http://localhost:3001/api';
    }
  }
};

// Configuración de fetch con manejo de errores
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

// Función para obtener URLs de fallback
export const getFallbackUrls = () => {
  const platform = getPlatform();
  
  const fallbackUrls = {
    android: ['http://10.0.2.2:3001', 'http://192.168.1.100:3001'],
    ios: ['http://localhost:3001', 'http://127.0.0.1:3001'],
    web: ['http://localhost:3001'],
    node: ['http://localhost:3001']
  };
  
  return fallbackUrls[platform] || fallbackUrls.web;
};
