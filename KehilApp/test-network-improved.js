#!/usr/bin/env node

// Script mejorado para probar la conectividad de red
// Usando fetch nativo (Node.js 18+)

console.log('🧪 Probando conectividad de red mejorada...');
console.log('===========================================');

// URLs a probar
const testUrls = [
  'http://localhost:3001/api/health',
  'http://127.0.0.1:3001/api/health',
  'http://10.0.2.2:3001/api/health',
  'http://192.168.1.100:3001/api/health',
  'http://192.168.0.100:3001/api/health'
];

// Función para probar una URL
async function testUrl(url) {
  try {
    console.log(`\n🔍 Probando: ${url}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ CONEXIÓN EXITOSA`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Database: ${data.database?.status || 'N/A'}`);
      return true;
    } else {
      console.log(`⚠️ Respuesta no exitosa: ${response.status}`);
      return false;
    }
    
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log(`⏰ Timeout - No responde`);
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log(`❌ Conexión rechazada - Puerto cerrado`);
    } else if (error.message.includes('ENOTFOUND')) {
      console.log(`❌ Host no encontrado`);
    } else {
      console.log(`❌ Error: ${error.message}`);
    }
    return false;
  }
}

// Función principal
async function testAllUrls() {
  console.log('📱 URLs de prueba para diferentes entornos:');
  console.log('   • localhost:3001 - Servidor local');
  console.log('   • 127.0.0.1:3001 - Localhost alternativo');
  console.log('   • 10.0.2.2:3001 - Emulador Android');
  console.log('   • 192.168.x.x:3001 - Red local');
  
  let workingUrls = [];
  
  for (const url of testUrls) {
    const isWorking = await testUrl(url);
    if (isWorking) {
      workingUrls.push(url);
    }
  }
  
  console.log('\n===========================================');
  console.log('🎯 RESUMEN DE PRUEBAS');
  console.log('===========================================');
  
  if (workingUrls.length > 0) {
    console.log(`✅ URLs funcionales: ${workingUrls.length}`);
    workingUrls.forEach((url, index) => {
      console.log(`   ${index + 1}. ${url}`);
    });
    
    console.log('\n💡 Para la app React Native:');
    if (workingUrls.some(url => url.includes('10.0.2.2'))) {
      console.log('   ✅ Emulador Android debería funcionar');
    }
    if (workingUrls.some(url => url.includes('localhost'))) {
      console.log('   ✅ Simulador iOS debería funcionar');
    }
    if (workingUrls.some(url => url.includes('192.168'))) {
      console.log('   ✅ Dispositivos físicos deberían funcionar');
    }
    
  } else {
    console.log('❌ No se pudo conectar a ninguna URL');
    console.log('\n🔧 Soluciones posibles:');
    console.log('   1. Verifica que el servidor esté corriendo: node start-server.js');
    console.log('   2. Verifica que el puerto 3001 esté libre');
    console.log('   3. Verifica que no haya firewall bloqueando');
  }
  
  console.log('\n📋 Para iniciar el servidor:');
  console.log('   node start-server.js');
}

// Ejecutar pruebas
testAllUrls();
