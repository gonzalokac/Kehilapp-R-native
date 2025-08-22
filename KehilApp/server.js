const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sql, config } = require('./db');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Función para probar conexión a base de datos
async function testDatabaseConnection() {
  try {
    const pool = await sql.connect(config);
    console.log('✅ Conexión a base de datos exitosa');
    await pool.close();
    return true;
  } catch (error) {
    console.error('❌ Error conectando a base de datos:', error.message);
    return false;
  }
}

// Ruta raíz
app.get('/', (req, res) => {
    res.json({ 
        message: '🕯 KehilApp API - Tu Comunidad Judía',
        version: '1.0.0',
        status: 'Funcionando',
        database: 'Conectado a SQL Server',
        endpoints: {
            root: '/',
            health: '/api/health',
            register: '/api/register',
            login: '/api/login',
            users: '/api/users',
            user: '/api/user/:id'
        }
    });
});

// Ruta de prueba con estado de base de datos
app.get('/api/health', async (req, res) => {
    const dbConnected = await testDatabaseConnection();
    
    res.json({ 
        status: 'OK', 
        message: 'Servidor funcionando',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: {
            connected: dbConnected,
            status: dbConnected ? 'Conectado' : 'Desconectado'
        }
    });
});

// Obtener todos los usuarios
app.get('/api/users', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool
            .request()
            .query('SELECT UsuarioID, Nombre, Apellido, Email, Telefono, FechaRegistro, EsEmpresa, Verificado FROM Usuarios');

        res.json({
            success: true,
            count: result.recordset.length,
            users: result.recordset
        });
        
        await pool.close();
    } catch (err) {
        console.error('Error obteniendo usuarios:', err);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
        });
    }
});

// Obtener usuario por ID
app.get('/api/user/:id', async (req, res) => {
    const usuarioID = req.params.id;

    try {
        const pool = await sql.connect(config);
        const result = await pool
            .request()
            .input('UsuarioID', sql.UniqueIdentifier, usuarioID)
            .query('SELECT UsuarioID, Nombre, Apellido, Email, Telefono, FechaRegistro, EsEmpresa, Verificado FROM Usuarios WHERE UsuarioID = @UsuarioID');

        if (result.recordset.length > 0) {
            res.json({
                success: true,
                user: result.recordset[0]
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        
        await pool.close();
    } catch (err) {
        console.error('Error al consultar la base de datos:', err);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
        });
    }
});

// Registro de usuarios
app.post('/api/register', async (req, res) => {
    try {
        const { nombre, apellido, email, password, telefono, esEmpresa } = req.body;
        
        // Validaciones básicas
        if (!nombre || !apellido || !email || !password || !telefono) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos'
            });
        }
        
        const pool = await sql.connect(config);
        
        // Verificar si el email ya existe
        const checkEmail = await pool
            .request()
            .input('Email', sql.VarChar, email)
            .query('SELECT UsuarioID FROM Usuarios WHERE Email = @Email');
            
        if (checkEmail.recordset.length > 0) {
            await pool.close();
            return res.status(400).json({
                success: false,
                message: 'El email ya está registrado'
            });
        }
        
        // Insertar nuevo usuario
        const result = await pool
            .request()
            .input('Nombre', sql.VarChar, nombre)
            .input('Apellido', sql.VarChar, apellido)
            .input('Email', sql.VarChar, email)
            .input('Password', sql.VarChar, password)
            .input('Telefono', sql.VarChar, telefono)
            .input('EsEmpresa', sql.Bit, esEmpresa || false)
            .input('Verificado', sql.Bit, esEmpresa || false) // Si es empresa, automáticamente verificado
            .input('FechaRegistro', sql.DateTime, new Date())
            .query(`
                INSERT INTO Usuarios (Nombre, Apellido, Email, Password, Telefono, EsEmpresa, Verificado, FechaRegistro)
                OUTPUT INSERTED.UsuarioID, INSERTED.Nombre, INSERTED.Apellido, INSERTED.Email, INSERTED.Telefono, INSERTED.EsEmpresa, INSERTED.Verificado, INSERTED.FechaRegistro
                VALUES (@Nombre, @Apellido, @Email, @Password, @Telefono, @EsEmpresa, @Verificado, @FechaRegistro)
            `);
        
        const newUser = result.recordset[0];
        
        await pool.close();
        
        res.json({
            success: true,
            message: 'Usuario registrado exitosamente',
            user: newUser
        });
        
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
        });
    }
});

// Login de usuarios
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validaciones básicas
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email y contraseña son requeridos'
            });
        }
        
        const pool = await sql.connect(config);
        
        // Buscar usuario por email y contraseña
        const result = await pool
            .request()
            .input('Email', sql.VarChar, email)
            .input('Password', sql.VarChar, password)
            .query('SELECT UsuarioID, Nombre, Apellido, Email, Telefono, FechaRegistro, EsEmpresa, Verificado FROM Usuarios WHERE Email = @Email AND Password = @Password');
        
        await pool.close();
        
        if (result.recordset.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas'
            });
        }
        
        const user = result.recordset[0];
        
        res.json({
            success: true,
            message: 'Login exitoso',
            user: user
        });
        
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
        });
    }
});

// Middleware para manejar rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada',
        requestedUrl: req.originalUrl,
        availableEndpoints: [
            'GET /',
            'GET /api/health',
            'GET /api/users',
            'GET /api/user/:id',
            'POST /api/register',
            'POST /api/login'
        ]
    });
});

// Middleware para manejar errores
app.use((error, req, res, next) => {
    console.error('Error del servidor:', error);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
});

// Iniciar servidor
app.listen(PORT, async () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📱 API disponible en http://localhost:${PORT}/api`);
    console.log(`💚 Estado del servidor: http://localhost:${PORT}/api/health`);
    
    // Probar conexión a base de datos
    const dbConnected = await testDatabaseConnection();
    if (dbConnected) {
        console.log(`🗄️ Base de datos SQL Server conectada`);
    } else {
        console.log(`⚠️ Base de datos no disponible - El servidor funcionará pero sin persistencia`);
    }
});

module.exports = app;
