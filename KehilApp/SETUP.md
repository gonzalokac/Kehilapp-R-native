# 🕯 KehilApp - Guía de Configuración Completa

## 📋 **Requisitos Previos**

### 1. **SQL Server**
- SQL Server 2019 o superior instalado y ejecutándose
- SQL Server Management Studio (SSMS) instalado
- Usuario con permisos para crear bases de datos

### 2. **Node.js**
- Node.js 18 o superior instalado
- npm o yarn instalado

### 3. **Expo CLI**
- Expo CLI instalado globalmente: `npm install -g @expo/cli`

## 🚀 **Paso a Paso para Configurar Todo**

### **Paso 1: Configurar la Base de Datos**

1. **Abrir SQL Server Management Studio**
2. **Conectarse a tu instancia de SQL Server**
3. **Ejecutar el script completo `carreandoASocha.sql`**
4. **Verificar que se creó la base de datos `kehilapp`**

```sql
-- Verificar que la base de datos existe
SELECT name FROM sys.databases WHERE name = 'kehilapp';

-- Verificar que la tabla Usuarios existe
USE kehilapp;
SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Usuarios';
```

### **Paso 2: Crear Usuario de Base de Datos (Opcional)**

Si quieres usar un usuario específico en lugar del usuario actual:

```sql
-- Crear login
CREATE LOGIN kehilapp_user WITH PASSWORD = 'Kehilapp123!';

-- Crear usuario en la base de datos
USE kehilapp;
CREATE USER kehilapp_user FOR LOGIN kehilapp_user;

-- Dar permisos
EXEC sp_addrolemember 'db_owner', 'kehilapp_user';
```

### **Paso 3: Verificar Configuración de Red**

El archivo `db.js` debe tener la configuración correcta:

```javascript
const config = {
    user: 'kehilapp_user',        // Tu usuario de SQL Server
    password: 'Kehilapp123!',     // Tu contraseña
    server: 'localhost',          // Tu servidor SQL Server
    database: 'kehilapp',        // Base de datos creada
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};
```

### **Paso 4: Instalar Dependencias del Servidor**

```bash
cd KehilApp
npm install express mssql cors body-parser
```

### **Paso 5: Iniciar el Servidor**

```bash
# Opción 1: Inicio rápido con verificación
node start-server.js

# Opción 2: Inicio directo
node server.js

# Opción 3: Con nodemon para desarrollo
npx nodemon server.js
```

### **Paso 6: Verificar que el Servidor Funciona**

Abrir en el navegador: `http://localhost:3001/api/health`

Deberías ver:
```json
{
  "status": "OK",
  "message": "Servidor funcionando",
  "database": {
    "connected": true,
    "status": "Conectado"
  }
}
```

### **Paso 7: Iniciar la Aplicación React Native**

```bash
# En otra terminal
cd KehilApp
npm start
```

## 🔧 **Solución de Problemas Comunes**

### **Error: "Login failed for user"**
- Verifica que el usuario y contraseña en `db.js` sean correctos
- Verifica que el usuario tenga permisos en la base de datos

### **Error: "Cannot connect to SQL Server"**
- Verifica que SQL Server esté ejecutándose
- Verifica que el puerto 1433 esté abierto
- Verifica que el firewall no esté bloqueando la conexión

### **Error: "Network request failed" en la app**
- Verifica que el servidor esté corriendo en el puerto 3001
- Verifica que la IP en la configuración sea correcta
- Para emulador Android: usar `10.0.2.2:3001`
- Para dispositivo físico: usar la IP de tu PC en la red local

### **Error: "Base de datos no disponible"**
- Ejecuta el script `carreandoASocha.sql` completo
- Verifica que la base de datos `kehilapp` exista
- Verifica que las tablas se hayan creado correctamente

## 📱 **Configuración de Red por Plataforma**

### **Android Emulador**
- URL: `http://10.0.2.2:3001/api`
- El emulador automáticamente redirige a localhost de tu PC

### **Android Dispositivo Físico**
- URL: `http://[IP_DE_TU_PC]:3001/api`
- Ejemplo: `http://192.168.1.100:3001/api`

### **iOS Simulador**
- URL: `http://localhost:3001/api`
- Funciona directamente en el simulador

### **iOS Dispositivo Físico**
- URL: `http://[IP_DE_TU_PC]:3001/api`
- Ejemplo: `http://192.168.1.100:3001/api`

## 🧪 **Probar el Registro**

1. **Abrir la app**
2. **Ir a "Registrarse"**
3. **Completar todos los campos**
4. **Tocar "Registrarse"**
5. **Verificar en la consola del servidor que se guardó en la base de datos**

## 📊 **Verificar Usuarios en la Base de Datos**

```sql
USE kehilapp;
SELECT 
    Nombre + ' ' + Apellido as NombreCompleto,
    Email,
    Telefono,
    CASE WHEN EsEmpresa = 1 THEN 'Sí' ELSE 'No' END as EsEmpresa,
    CASE WHEN Verificado = 1 THEN 'Sí' ELSE 'No' END as Verificado,
    FechaRegistro
FROM Usuarios
ORDER BY FechaRegistro DESC;
```

## ✅ **Indicadores de Éxito**

- ✅ Servidor responde en `http://localhost:3001/api/health`
- ✅ Base de datos conectada (status: "Conectado")
- ✅ App móvil se conecta al servidor
- ✅ Registro de usuarios funciona sin errores
- ✅ Usuarios aparecen en la base de datos
- ✅ No hay errores de red (TypeError) en la consola

## 🆘 **Si Algo No Funciona**

1. **Revisar logs del servidor** en la terminal
2. **Revisar logs de la app** en la consola de Expo
3. **Verificar estado de la base de datos** con SSMS
4. **Probar endpoints manualmente** con Postman o similar
5. **Verificar configuración de red** y firewalls

---

**🎯 Con esta configuración, el registro de usuarios debería funcionar perfectamente y guardarse en la base de datos SQL Server sin errores de red.**
