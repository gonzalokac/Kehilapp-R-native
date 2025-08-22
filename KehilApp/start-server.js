#!/usr/bin/env node

const { sql, config } = require('./db');
const app = require('./server');

console.log('🚀 Iniciando KehilApp Server...');
console.log('=====================================');

// Función para verificar la base de datos
async function checkDatabase() {
  try {
    console.log('🔍 Verificando conexión a la base de datos...');
    const pool = await sql.connect(config);
    
    // Verificar si la tabla Usuarios existe
    const result = await pool.request().query(`
      SELECT COUNT(*) as count 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_NAME = 'Usuarios'
    `);
    
    if (result.recordset[0].count > 0) {
      console.log('✅ Base de datos conectada y tabla Usuarios encontrada');
      
      // Contar usuarios existentes
      const userCount = await pool.request().query('SELECT COUNT(*) as count FROM Usuarios');
      console.log(`📊 Usuarios en la base de datos: ${userCount.recordset[0].count}`);
      
    } else {
      console.log('⚠️ Base de datos conectada pero tabla Usuarios no encontrada');
      console.log('💡 Ejecuta el script carreandoASocha.sql en SQL Server');
    }
    
    await pool.close();
    return true;
    
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error.message);
    console.log('');
    console.log('🔧 Soluciones posibles:');
    console.log('1. Verifica que SQL Server esté ejecutándose');
    console.log('2. Verifica las credenciales en db.js');
    console.log('3. Verifica que la base de datos "kehilapp" exista');
    console.log('4. Ejecuta el script carreandoASocha.sql');
    console.log('');
    return false;
  }
}

// Función principal
async function startServer() {
  try {
    // Verificar base de datos
    const dbOk = await checkDatabase();
    
    if (!dbOk) {
      console.log('⚠️ Continuando sin base de datos...');
      console.log('📱 La app funcionará en modo local');
    }
    
    console.log('');
    console.log('🌐 Servidor iniciado en http://localhost:3001');
    console.log('📱 API disponible en http://localhost:3001/api');
    console.log('💚 Estado del servidor: http://localhost:3001/api/health');
    console.log('');
    
    if (dbOk) {
      console.log('✅ El registro de usuarios funcionará con la base de datos');
    } else {
      console.log('⚠️ El registro de usuarios funcionará solo localmente');
    }
    
  } catch (error) {
    console.error('❌ Error iniciando servidor:', error.message);
    process.exit(1);
  }
}

// Ejecutar
startServer();
