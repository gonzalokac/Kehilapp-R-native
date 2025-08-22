#!/usr/bin/env node

const { sql, config } = require('./db');

console.log('🔍 Verificando configuración de KehilApp...');
console.log('===========================================');

// Verificar configuración de base de datos
async function checkDatabaseConfig() {
  console.log('\n📊 Verificando configuración de base de datos...');
  console.log(`Servidor: ${config.server}`);
  console.log(`Base de datos: ${config.database}`);
  console.log(`Usuario: ${config.user}`);
  
  try {
    const pool = await sql.connect(config);
    console.log('✅ Conexión a SQL Server exitosa');
    
    // Verificar base de datos
    const dbResult = await pool.request().query(`
      SELECT name FROM sys.databases WHERE name = '${config.database}'
    `);
    
    if (dbResult.recordset.length > 0) {
      console.log(`✅ Base de datos '${config.database}' encontrada`);
      
      // Verificar tabla Usuarios
      const tableResult = await pool.request().query(`
        USE ${config.database};
        SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Usuarios'
      `);
      
      if (tableResult.recordset[0].count > 0) {
        console.log('✅ Tabla Usuarios encontrada');
        
        // Contar usuarios
        const userCount = await pool.request().query('SELECT COUNT(*) as count FROM Usuarios');
        console.log(`📊 Usuarios en la base de datos: ${userCount.recordset[0].count}`);
        
        // Mostrar usuarios de ejemplo
        const sampleUsers = await pool.request().query(`
          SELECT TOP 3 Nombre, Apellido, Email, EsEmpresa, Verificado 
          FROM Usuarios 
          ORDER BY FechaRegistro DESC
        `);
        
        if (sampleUsers.recordset.length > 0) {
          console.log('\n👥 Usuarios de ejemplo:');
          sampleUsers.recordset.forEach((user, index) => {
            console.log(`  ${index + 1}. ${user.Nombre} ${user.Apellido} (${user.Email})`);
            console.log(`     Empresa: ${user.EsEmpresa ? 'Sí' : 'No'}, Verificado: ${user.Verificado ? 'Sí' : 'No'}`);
          });
        }
        
      } else {
        console.log('❌ Tabla Usuarios NO encontrada');
        console.log('💡 Ejecuta el script carreandoASocha.sql');
      }
      
    } else {
      console.log(`❌ Base de datos '${config.database}' NO encontrada`);
      console.log('💡 Ejecuta el script carreandoASocha.sql');
    }
    
    await pool.close();
    return true;
    
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error.message);
    return false;
  }
}

// Verificar puerto del servidor
async function checkServerPort() {
  console.log('\n🌐 Verificando puerto del servidor...');
  
  try {
    const net = require('net');
    const server = net.createServer();
    
    server.listen(3001, () => {
      console.log('✅ Puerto 3001 disponible');
      server.close();
    });
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log('⚠️ Puerto 3001 ya está en uso');
        console.log('💡 Verifica que no haya otro servidor corriendo');
      } else {
        console.log('❌ Error verificando puerto:', err.message);
      }
    });
    
  } catch (error) {
    console.log('❌ Error verificando puerto:', error.message);
  }
}

// Verificar dependencias
function checkDependencies() {
  console.log('\n📦 Verificando dependencias...');
  
  const requiredDeps = ['express', 'mssql', 'cors', 'body-parser'];
  const packageJson = require('./package.json');
  
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
      console.log(`✅ ${dep}: ${packageJson.dependencies[dep]}`);
    } else {
      console.log(`❌ ${dep}: NO encontrada`);
    }
  });
}

// Función principal
async function main() {
  try {
    checkDependencies();
    await checkDatabaseConfig();
    await checkServerPort();
    
    console.log('\n===========================================');
    console.log('🎯 RESUMEN DE VERIFICACIÓN');
    console.log('===========================================');
    
    console.log('\n📋 Para iniciar el servidor:');
    console.log('  node start-server.js');
    
    console.log('\n📱 Para iniciar la app:');
    console.log('  npm start');
    
    console.log('\n🔗 Endpoints disponibles:');
    console.log('  http://localhost:3001/ (API info)');
    console.log('  http://localhost:3001/api/health (Estado)');
    console.log('  http://localhost:3001/api/register (Registro)');
    console.log('  http://localhost:3001/api/login (Login)');
    
  } catch (error) {
    console.error('❌ Error en la verificación:', error.message);
  }
}

// Ejecutar
main();
