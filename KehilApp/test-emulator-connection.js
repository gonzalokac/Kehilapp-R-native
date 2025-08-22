#!/usr/bin/env node

// Script para probar conectividad desde el punto de vista del emulador
console.log('🧪 Probando conectividad para emulador Android...');
console.log('===========================================');

// Simular las URLs que probaría la app
const testUrls = [
  'http://10.0.2.2:3001/api/health',      // Emulador Android -> PC host
  'http://localhost:3001/api/health',      // Local (no funciona en emulador)
  'http://127.0.0.1:3001/api/health',     // Local alternativo
];

console.log('📱 URLs que probaría la app React Native:');
console.log('   • 10.0.2.2:3001 - Emulador Android → PC host (DEBERÍA funcionar)');
console.log('   • localhost:3001 - Local (NO funciona en emulador)');
console.log('   • 127.0.0.1:3001 - Local alternativo (NO funciona en emulador)');

// Función para probar una URL
async function testUrl(url, description) {
  try {
    console.log(`\n🔍 Probando: ${url}`);
    console.log(`   Descripción: ${description}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ CONEXIÓN EXITOSA`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Database: ${data.database?.status || 'N/A'}`);
      return true;
    } else {
      console.log(`   ⚠️ Respuesta no exitosa: ${response.status}`);
      return false;
    }
    
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log(`   ⏰ Timeout - No responde`);
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log(`   ❌ Conexión rechazada - Puerto cerrado`);
    } else if (error.message.includes('ENOTFOUND')) {
      console.log(`   ❌ Host no encontrado`);
    } else {
      console.log(`   ❌ Error: ${error.message}`);
    }
    return false;
  }
}

// Función principal
async function testAllUrls() {
  console.log('\n🎯 INICIANDO PRUEBAS DE CONECTIVIDAD');
  console.log('===========================================');
  
  let workingUrls = [];
  
  // Probar cada URL
  for (const url of testUrls) {
    let description = '';
    if (url.includes('10.0.2.2')) {
      description = 'Emulador Android → PC host (DEBERÍA funcionar)';
    } else if (url.includes('localhost') || url.includes('127.0.0.1')) {
      description = 'Local (NO funciona en emulador)';
    }
    
    const isWorking = await testUrl(url, description);
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
    
    console.log('\n💡 DIAGNÓSTICO:');
    if (workingUrls.some(url => url.includes('10.0.2.2'))) {
      console.log('   ✅ 10.0.2.2:3001 FUNCIONA - El emulador puede conectar');
      console.log('   🎉 La app debería funcionar correctamente');
    } else {
      console.log('   ❌ 10.0.2.2:3001 NO funciona - Problema de red');
      console.log('   🔧 Verificar configuración del emulador');
    }
    
  } else {
    console.log('❌ No se pudo conectar a ninguna URL');
    console.log('\n🔧 SOLUCIONES POSIBLES:');
    console.log('   1. Verificar que el servidor esté corriendo en puerto 3001');
    console.log('   2. Verificar que no haya firewall bloqueando');
    console.log('   3. Verificar configuración del emulador Android');
    console.log('   4. Probar con diferentes IPs de red');
  }
  
  console.log('\n📋 COMANDOS ÚTILES:');
  console.log('   • Verificar servidor: node start-server.js');
  console.log('   • Verificar puerto: netstat -ano | findstr :3001');
  console.log('   • Probar local: curl http://localhost:3001/api/health');
  
  console.log('\n🔍 EXPLICACIÓN DEL PROBLEMA:');
  console.log('   El emulador Android corre en una máquina virtual separada');
  console.log('   Para conectar a la PC host, debe usar 10.0.2.2');
  console.log('   localhost en el emulador se refiere al emulador mismo, no a la PC');
}

// Ejecutar pruebas
testAllUrls();
