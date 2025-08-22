#!/usr/bin/env node

// Script de prueba para verificar la configuración de red
const { getApiUrl, testConnection, getBestApiUrl } = require('./config/network');

console.log('🧪 Probando configuración de red...');
console.log('=====================================');

async function testNetworkConfig() {
  try {
    console.log('1️⃣ Obteniendo URLs de API...');
    const urls = await getApiUrl();
    console.log('URLs disponibles:', urls);
    
    console.log('\n2️⃣ Probando conexiones...');
    const workingUrl = await testConnection(urls);
    console.log('✅ URL funcional encontrada:', workingUrl);
    
    console.log('\n3️⃣ Obteniendo mejor URL...');
    const bestUrl = await getBestApiUrl();
    console.log('🎯 Mejor URL:', bestUrl);
    
    console.log('\n✅ Todas las pruebas pasaron correctamente!');
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
  }
}

// Ejecutar pruebas
testNetworkConfig();
