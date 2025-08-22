// Configuración de red simplificada para KehilApp
// Funciona tanto en servidor como en cliente

// Configuración básica
export const NETWORK_CONFIG = {
  SERVER_PORT: 3001,
  REQUEST_TIMEOUT: 10000,
};

// URLs por defecto
const DEFAULT_URLS = {
  android: 'http://10.0.2.2:3001/api',
  ios: 'http://localhost:3001/api',
  web: 'http://localhost:3001/api',
  node: 'http://localhost:3001/api'
};

// Función simple para obtener URL según plataforma
export const getApiUrl = (platform = 'web') => {
  return DEFAULT_URLS[platform] || DEFAULT_URLS.web;
};

// Función para probar conexión
export const testConnection = async (url) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), NETWORK_CONFIG.REQUEST_TIMEOUT);
    
    const response = await fetch(`${url}/health`, {
      method: 'GET',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' }
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
export const getBestApiUrl = async (platform = 'web') => {
  const url = getApiUrl(platform);
  
  if (await testConnection(url)) {
    return url;
  }
  
  // Si falla, retornar URL por defecto
  return url;
};

// Fetch seguro con timeout
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
