// Configuración de la API para diferentes entornos
const API_CONFIG = {
  // Desarrollo local
  development: {
    android: 'http://10.0.2.2:3001/api',  // Emulador Android
    ios: 'http://localhost:3001/api',       // Simulador iOS
    web: 'http://localhost:3001/api'        // Web
  },
  // Producción
  production: {
    android: 'https://tu-servidor-produccion.com/api',
    ios: 'https://tu-servidor-produccion.com/api',
    web: 'https://tu-servidor-produccion.com/api'
  }
};

// Función para obtener la URL correcta según la plataforma
export const getApiUrl = () => {
  const platform = Platform.OS;
  const environment = __DEV__ ? 'development' : 'production';
  
  return API_CONFIG[environment][platform] || API_CONFIG[environment].web;
};

// URL por defecto (para desarrollo)
export const API_BASE_URL = __DEV__ ? 'http://10.0.2.2:3001/api' : 'https://tu-servidor-produccion.com/api';

// URLs específicas por plataforma
export const API_URLS = {
  android: 'http://10.0.2.2:3001/api',
  ios: 'http://localhost:3001/api',
  web: 'http://localhost:3001/api'
};
