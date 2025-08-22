import { Platform } from 'react-native';

// Configuración de red que FUNCIONA para emulador Android
export const NETWORK_CONFIG = {
  SERVER_PORT: 3001,
  REQUEST_TIMEOUT: 30000, // 30 segundos para emulador
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
      // Para emulador Android, usar 10.0.2.2 (localhost de la PC host)
      return 'http://10.0.2.2:3001/api';
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

// Función para probar conexión con una URL específica
export const testConnection = async (url) => {
  try {
    console.log(`🔍 Probando conexión a: ${url}`);
    
    const response = await fetch(`${url}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000
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
    return false;
  }
};

// Función para obtener la mejor URL disponible
export const getBestApiUrl = async () => {
  try {
    // Para emulador Android, usar directamente 10.0.2.2
    if (Platform.OS === 'android' && isEmulator()) {
      const url = 'http://10.0.2.2:3001/api';
      console.log(`🎯 Emulador Android detectado, usando: ${url}`);
      return url;
    }
    
    // Para otras plataformas, probar múltiples URLs
    const urls = [];
    
    if (Platform.OS === 'ios') {
      if (isEmulator()) {
        urls.push('http://localhost:3001/api');
        urls.push('http://127.0.0.1:3001/api');
      } else {
        urls.push('http://192.168.1.100:3001/api');
        urls.push('http://192.168.0.100:3001/api');
      }
    }
    
    // Probar cada URL
    for (const url of urls) {
      if (await testConnection(url)) {
        return url;
      }
    }
    
    // Si no se pudo conectar a ninguna, retornar la URL por defecto
    return getApiUrl();
    
  } catch (error) {
    console.error('Error obteniendo URL de API:', error);
    return getApiUrl();
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
