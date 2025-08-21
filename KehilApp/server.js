const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Almacenamiento temporal de usuarios (en producción usar base de datos)
let users = [
  {
    id: 1,
    nombre: 'Usuario Demo',
    email: 'demo@kehilapp.com',
    password: '123456',
    telefono: '+54 11 1234-5678',
    fechaRegistro: new Date('2024-01-01')
  }
];

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ 
    message: '🕯 KehilApp API - Tu Comunidad Judía',
    version: '1.0.0',
    status: 'Funcionando',
    endpoints: {
      root: '/',
      health: '/api/health',
      register: '/api/register',
      login: '/api/login',
      users: '/api/users'
    }
  });
});

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor funcionando',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Obtener todos los usuarios (solo para desarrollo)
app.get('/api/users', (req, res) => {
  try {
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.json({
      success: true,
      count: usersWithoutPasswords.length,
      users: usersWithoutPasswords
    });
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Rutas de la API
app.post('/api/register', (req, res) => {
  try {
    const { nombre, email, password, telefono } = req.body;
    
    // Validaciones básicas
    if (!nombre || !email || !password || !telefono) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }
    
    // Verificar si el email ya existe
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }
    
    // Crear nuevo usuario
    const newUser = {
      id: users.length + 1,
      nombre,
      email,
      password, // En producción, hashear la contraseña
      telefono,
      fechaRegistro: new Date()
    };
    
    users.push(newUser);
    
    // Retornar usuario sin contraseña
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

app.post('/api/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validaciones básicas
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }
    
    // Buscar usuario
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas'
      });
    }
    
    // Retornar usuario sin contraseña
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      message: 'Login exitoso',
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
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
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📱 API disponible en http://localhost:${PORT}/api`);
  console.log(`💚 Estado del servidor: http://localhost:${PORT}/api/health`);
  console.log(`👥 Usuarios registrados: ${users.length}`);
  console.log(`🔐 Usuario demo: demo@kehilapp.com / 123456`);
});

module.exports = app;
