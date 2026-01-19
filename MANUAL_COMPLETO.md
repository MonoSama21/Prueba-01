# 📘 Manual Completo - Crear API de Boda desde Cero

## 📋 Tabla de Contenidos
1. [Requisitos Previos](#requisitos-previos)
2. [Configuración del Proyecto](#configuración-del-proyecto)
3. [Instalación de Dependencias](#instalación-de-dependencias)
4. [Configuración de Supabase](#configuración-de-supabase)
5. [Estructura del Proyecto](#estructura-del-proyecto)
6. [Configuración de Archivos](#configuración-de-archivos)
7. [Ejecución y Pruebas](#ejecución-y-pruebas)
8. [Despliegue](#despliegue)

---

## 1. Requisitos Previos

### Software Necesario
- **Node.js** (v18 o superior) - [Descargar](https://nodejs.org/)
- **npm** (incluido con Node.js)
- **Git** (opcional) - [Descargar](https://git-scm.com/)
- **Postman** (para pruebas) - [Descargar](https://www.postman.com/)
- **VS Code** (editor recomendado) - [Descargar](https://code.visualstudio.com/)

### Cuenta Necesaria
- Cuenta en **Supabase** (gratuita) - [Crear cuenta](https://supabase.com/)

---

## 2. Configuración del Proyecto

### Paso 1: Crear la Carpeta del Proyecto
```bash
mkdir BACKEND_BODA_D-V
cd BACKEND_BODA_D-V
```

### Paso 2: Inicializar el Proyecto Node.js
```bash
npm init -y
```

---

## 3. Instalación de Dependencias

### Paso 3: Instalar Dependencias de Producción
```bash
npm install express cors body-parser dotenv @supabase/supabase-js jsonwebtoken swagger-jsdoc swagger-ui-express js-yaml
```

**¿Qué hace cada dependencia?**
- `express`: Framework web para Node.js
- `cors`: Permitir peticiones desde otros dominios
- `body-parser`: Parsear datos JSON del body
- `dotenv`: Manejar variables de entorno
- `@supabase/supabase-js`: Cliente de Supabase
- `jsonwebtoken`: Crear y verificar tokens JWT
- `swagger-jsdoc`: Generar documentación Swagger
- `swagger-ui-express`: Interfaz visual para documentación
- `js-yaml`: Exportar documentación en formato YAML

### Paso 4: Instalar Dependencias de Desarrollo
```bash
npm install --save-dev typescript @types/node @types/express @types/cors @types/body-parser @types/jsonwebtoken @types/swagger-jsdoc @types/swagger-ui-express @types/js-yaml ts-node ts-node-dev nodemon
```

**¿Qué hace cada dependencia de desarrollo?**
- `typescript`: Lenguaje TypeScript
- `@types/*`: Definiciones de tipos para TypeScript
- `ts-node`: Ejecutar TypeScript directamente
- `ts-node-dev`: Reinicio automático en desarrollo
- `nodemon`: Monitor de cambios en archivos

### Paso 5: Inicializar TypeScript
```bash
npx tsc --init
```
crea el tsconifg.json

---

## 4. Configuración de Supabase

### Paso 6: Crear Proyecto en Supabase

1. Ve a [https://supabase.com/](https://supabase.com/)
2. Crea una cuenta o inicia sesión
3. Haz clic en **"New Project"**
4. Completa los datos:
   - **Name**: `boda-diter-vivian`
   - **Database Password**: (guárdala en un lugar seguro)
   - **Region**: Elige la más cercana a ti
5. Espera 2-3 minutos a que se cree el proyecto

### Paso 7: Crear la Tabla en Supabase

1. En tu proyecto de Supabase, ve a **"Table Editor"**
2. Haz clic en **"Create a new table"**
3. Usa este SQL para crear la tabla:

```sql
-- Crear tabla de confirmaciones de asistencia
CREATE TABLE confirmaciones_asistencia (
  id BIGSERIAL PRIMARY KEY,
  nombre_completo TEXT NOT NULL,
  correo_electronico TEXT NOT NULL,
  telefono TEXT,
  asistira BOOLEAN NOT NULL DEFAULT false,
  numero_invitados INTEGER NOT NULL DEFAULT 1,
  cancion_favorita TEXT,
  mensaje TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para mejorar búsquedas por email
CREATE INDEX idx_correo ON confirmaciones_asistencia(correo_electronico);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_confirmaciones_updated_at BEFORE UPDATE
ON confirmaciones_asistencia FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

4. Ejecuta el SQL haciendo clic en **"Run"**

### Paso 8: Obtener las Credenciales de Supabase

1. Ve a **Settings > API** en tu proyecto
2. Copia:
   - **URL**: `https://tu-proyecto.supabase.co`
   - **anon public key**: `eyJhbGci...` (token largo)

---

## 5. Estructura del Proyecto

### Paso 9: Crear la Estructura de Carpetas

```bash
mkdir config controllers models routes types middleware docs
```

Tu estructura debe verse así:
```
BACKEND_BODA_D-V/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── types/
├── docs/
├── node_modules/
├── .env
├── .env.example
├── .gitignore
├── index.ts
├── generate-docs.ts
├── package.json
└── tsconfig.json
```

---

## 6. Configuración de Archivos

### Paso 10: Configurar tsconfig.json
Reemplaza el contenido con:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./",
    "removeComments": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

### Paso 11: Crear .gitignore
```bash
echo "node_modules
dist
.env
*.log" > .gitignore
```

### Paso 12: Configurar package.json Scripts
Abre `package.json` y agrega estos scripts:
```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node-dev --respawn --transpile-only index.ts",
    "dev:watch": "nodemon --exec ts-node index.ts",
    "docs": "ts-node generate-docs.ts"
  }
}
```

### Paso 13: Crear .env
```bash
# Crear archivo .env
touch .env
```

Contenido del `.env`:
```env
# Configuración de Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-anon-public-key-aqui

# Configuración del servidor
PORT=3000

# Credenciales de administrador (Novios)
ADMIN_USERNAME=diter-vivian
ADMIN_PASSWORD=BodaDyV2026!

# Secreto para JWT (CAMBIAR EN PRODUCCIÓN)
JWT_SECRET=mi-secreto-muy-seguro-aleatorio-largo-para-produccion-2026
```

⚠️ **Importante**: Reemplaza `SUPABASE_URL` y `SUPABASE_KEY` con tus credenciales reales.

### Paso 14: Crear .env.example (para compartir)
```bash
cp .env .env.example
```

---

## 7. Crear los Archivos del Proyecto

### Paso 15: types/index.ts
```typescript
export interface ConfirmacionAsistencia {
  id?: number;
  nombre_completo: string;
  correo_electronico: string;
  telefono?: string | null;
  asistira: boolean;
  numero_invitados: number;
  cancion_favorita?: string | null;
  mensaje?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface ModelResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

### Paso 16: config/supabase.ts
```typescript
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('⚠️ SUPABASE_URL y SUPABASE_KEY son requeridas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
```

### Paso 17: config/swagger.ts
```typescript
import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Confirmación de Asistencia - Boda Diter y Vivian',
      version: '2.0.0',
      description: 'API REST para gestionar las confirmaciones de asistencia a la boda',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desarrollo',
      },
    ],
    tags: [
      {
        name: 'Autenticación',
        description: 'Endpoints para autenticación de los novios',
      },
      {
        name: 'Confirmaciones',
        description: 'Endpoints para gestionar confirmaciones de asistencia',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtenido del endpoint de login',
        },
      },
      schemas: {
        ConfirmacionAsistencia: {
          type: 'object',
          required: ['nombre_completo', 'correo_electronico', 'asistira', 'numero_invitados'],
          properties: {
            id: { type: 'integer', example: 1 },
            nombre_completo: { type: 'string', example: 'Juan Pérez' },
            correo_electronico: { type: 'string', format: 'email', example: 'juan@example.com' },
            telefono: { type: 'string', nullable: true, example: '+1234567890' },
            asistira: { type: 'boolean', example: true },
            numero_invitados: { type: 'integer', example: 2, minimum: 1 },
            cancion_favorita: { type: 'string', nullable: true, example: 'Perfect - Ed Sheeran' },
            mensaje: { type: 'string', nullable: true, example: '¡Felicidades!' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error al procesar la solicitud' },
            error: { type: 'string', example: 'Detalle del error' },
          },
        },
      },
    },
  },
  apis: ['./routes/*.ts', './controllers/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;
```

### Paso 18: models/formularioModel.ts
```typescript
import supabase from '../config/supabase';
import { ConfirmacionAsistencia, ModelResponse } from '../types';

class FormularioModel {
  static async crearConfirmacion(
    datos: Omit<ConfirmacionAsistencia, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ModelResponse<ConfirmacionAsistencia>> {
    try {
      const { data, error } = await supabase
        .from('confirmaciones_asistencia')
        .insert([datos])
        .select()
        .single();

      if (error) throw error;

      return { success: true, data: data as ConfirmacionAsistencia };
    } catch (error: any) {
      console.error('Error al crear confirmación:', error);
      return { success: false, error: error.message };
    }
  }

  static async obtenerTodasConfirmaciones(): Promise<ModelResponse<ConfirmacionAsistencia[]>> {
    try {
      const { data, error } = await supabase
        .from('confirmaciones_asistencia')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, data: data as ConfirmacionAsistencia[] };
    } catch (error: any) {
      console.error('Error al obtener confirmaciones:', error);
      return { success: false, error: error.message };
    }
  }
}

export default FormularioModel;
```

### Paso 19: middleware/auth.ts
```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: { username: string };
    }
  }
}

export const verificarToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Acceso denegado. No se proporcionó un token de autenticación.',
      });
      return;
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'tu-secreto-super-seguro-cambiar-en-produccion';
    const decoded = jwt.verify(token, JWT_SECRET) as { username: string };
    req.user = decoded;

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        message: 'El token ha expirado. Por favor, inicie sesión nuevamente.',
      });
      return;
    }

    res.status(403).json({
      success: false,
      message: 'Token inválido o corrupto.',
    });
  }
};
```

### Paso 20: controllers/authController.ts
```typescript
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        res.status(400).json({
          success: false,
          message: 'Usuario y contraseña son requeridos',
        });
        return;
      }

      const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'diter-vivian';
      const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'BodaDyV2026!';
      const JWT_SECRET = process.env.JWT_SECRET || 'tu-secreto-super-seguro-cambiar-en-produccion';

      if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
        res.status(401).json({
          success: false,
          message: 'Usuario o contraseña incorrectos',
        });
        return;
      }

      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });

      res.status(200).json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: { token, expiresIn: '24h', username },
      });
    } catch (error: any) {
      console.error('Error en login:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message,
      });
    }
  }
}

export default AuthController;
```

### Paso 21: controllers/formularioController.ts
```typescript
import FormularioModel from '../models/formularioModel';
import { ApiResponse, ConfirmacionAsistencia } from '../types';
import { Request, Response } from 'express';

class FormularioController {
  static async crearConfirmacion(req: Request, res: Response): Promise<void> {
    try {
      const datos: Omit<ConfirmacionAsistencia, 'id' | 'created_at' | 'updated_at'> = req.body;

      if (!datos || Object.keys(datos).length === 0) {
        res.status(400).json({
          success: false,
          message: 'El cuerpo de la solicitud no puede estar vacío',
        } as ApiResponse);
        return;
      }

      const camposRequeridos = ['nombre_completo', 'correo_electronico', 'asistira', 'numero_invitados'];
      const camposFaltantes = camposRequeridos.filter((campo) => !(campo in datos));

      if (camposFaltantes.length > 0) {
        res.status(400).json({
          success: false,
          message: `Faltan los siguientes campos requeridos: ${camposFaltantes.join(', ')}`,
        } as ApiResponse);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(datos.correo_electronico)) {
        res.status(400).json({
          success: false,
          message: 'El formato del correo electrónico no es válido',
        } as ApiResponse);
        return;
      }

      const resultado = await FormularioModel.crearConfirmacion(datos);
      res.status(201).json({
        success: true,
        message: 'Confirmación de asistencia creada exitosamente',
        data: resultado.data,
      } as ApiResponse);
    } catch (error: any) {
      console.error('Error en el controlador:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message,
      } as ApiResponse);
    }
  }

  static async obtenerTodasConfirmaciones(req: Request, res: Response): Promise<void> {
    try {
      const resultado = await FormularioModel.obtenerTodasConfirmaciones();

      if (!resultado.success) {
        res.status(500).json({
          success: false,
          message: 'Error al obtener las confirmaciones',
          error: resultado.error,
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Confirmaciones obtenidas exitosamente',
        data: resultado.data,
      } as ApiResponse);
    } catch (error: any) {
      console.error('Error en el controlador:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message,
      } as ApiResponse);
    }
  }
}

export default FormularioController;
```

### Paso 22: routes/authRoutes.ts
```typescript
import { Router } from 'express';
import AuthController from '../controllers/authController';

const router: Router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Autenticación
 *     summary: Iniciar sesión para los novios
 *     description: Genera un token JWT para acceder a endpoints protegidos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: diter-vivian
 *               password:
 *                 type: string
 *                 format: password
 *                 example: BodaDyV2026!
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       401:
 *         description: Credenciales incorrectas
 */
router.post('/login', AuthController.login);

export default router;
```

### Paso 23: routes/formularioRoutes.ts
```typescript
import { Router } from 'express';
import FormularioController from '../controllers/formularioController';
import { verificarToken } from '../middleware/auth';

const router: Router = Router();

/**
 * @swagger
 * /boda/asistencia:
 *   post:
 *     tags:
 *       - Confirmaciones
 *     summary: Crear una nueva confirmación de asistencia
 *     description: Registra la confirmación de asistencia de un invitado a la boda
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConfirmacionAsistencia'
 *     responses:
 *       201:
 *         description: Confirmación creada exitosamente
 *       400:
 *         description: Error de validación
 */
router.post('/', FormularioController.crearConfirmacion);

/**
 * @swagger
 * /boda/asistencia:
 *   get:
 *     tags:
 *       - Confirmaciones
 *     summary: Obtener todas las confirmaciones (Protegido)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de confirmaciones
 *       401:
 *         description: No autorizado
 */
router.get('/', verificarToken, FormularioController.obtenerTodasConfirmaciones);

export default router;
```

### Paso 24: index.ts (Archivo Principal)
```typescript
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import formularioRoutes from './routes/formularioRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta de bienvenida
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'API para la confirmación de asistencia a la boda de Diter y Vivian',
    version: '2.0.0',
    endpoints: {
      crear: 'POST /boda/asistencia',
      obtenerTodas: 'GET /boda/asistencia (🔒 Requiere autenticación)',
      login: 'POST /auth/login',
      documentacion: 'GET /api-docs',
    },
  });
});

// Documentación Swagger
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API Boda Diter y Vivian',
  })
);

// Rutas de la API
app.use('/auth', authRoutes);
app.use('/boda/asistencia', formularioRoutes);

// Manejo de rutas no encontradas
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
});

// Manejo de errores
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: err.message,
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor TypeScript corriendo en http://localhost:${PORT}`);
  console.log(`📋 Endpoints disponibles en http://localhost:${PORT}/boda/asistencia`);
  console.log(`📚 Documentación disponible en http://localhost:${PORT}/api-docs`);
});
```

### Paso 25: generate-docs.ts
```typescript
import swaggerSpec from './config/swagger';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

fs.writeFileSync('./docs/api-docs.json', JSON.stringify(swaggerSpec, null, 2));
fs.writeFileSync('./docs/api-docs.yml', yaml.dump(swaggerSpec, { indent: 2 }));

console.log('✅ Documentación generada exitosamente:');
console.log('   📄 ./docs/api-docs.json');
console.log('   📄 ./docs/api-docs.yml');
```

---

## 8. Ejecución y Pruebas

### Paso 26: Compilar TypeScript (opcional)
```bash
npm run build
```

### Paso 27: Iniciar el Servidor en Modo Desarrollo
```bash
npm run dev
```

Deberías ver:
```
🚀 Servidor TypeScript corriendo en http://localhost:3000
📋 Endpoints disponibles en http://localhost:3000/boda/asistencia
📚 Documentación disponible en http://localhost:3000/api-docs
```

### Paso 28: Generar Documentación
```bash
npm run docs
```

### Paso 29: Probar los Endpoints

#### 1. Crear Confirmación (POST)
**URL**: `http://localhost:3000/boda/asistencia`  
**Método**: POST  
**Headers**: `Content-Type: application/json`  
**Body**:
```json
{
  "nombre_completo": "Juan Pérez",
  "correo_electronico": "juan@example.com",
  "asistira": true,
  "numero_invitados": 2,
  "cancion_favorita": "Perfect - Ed Sheeran",
  "mensaje": "¡Felicidades!"
}
```

#### 2. Login (POST)
**URL**: `http://localhost:3000/auth/login`  
**Método**: POST  
**Body**:
```json
{
  "username": "diter-vivian",
  "password": "BodaDyV2026!"
}
```

Copia el `token` de la respuesta.

#### 3. Obtener Confirmaciones (GET - Protegido)
**URL**: `http://localhost:3000/boda/asistencia`  
**Método**: GET  
**Headers**:
```
Authorization: Bearer {pega-aqui-tu-token}
```

---

## 9. Despliegue

### Opción 1: Railway.app (Recomendado)

1. Crea cuenta en [Railway.app](https://railway.app/)
2. Conecta tu repositorio de GitHub
3. Agrega las variables de entorno en Railway
4. Deploy automático

### Opción 2: Render.com

1. Crea cuenta en [Render.com](https://render.com/)
2. Crea un nuevo **Web Service**
3. Conecta tu repositorio
4. Configura:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. Agrega variables de entorno

### Opción 3: Vercel

1. Crea cuenta en [Vercel.com](https://vercel.com/)
2. Instala Vercel CLI: `npm i -g vercel`
3. Ejecuta: `vercel`
4. Sigue las instrucciones

---

## 🎉 ¡Proyecto Completado!

Tu API está lista con:
- ✅ TypeScript
- ✅ Express.js
- ✅ Supabase (PostgreSQL)
- ✅ Autenticación JWT
- ✅ Documentación Swagger
- ✅ CORS habilitado
- ✅ Validaciones
- ✅ Manejo de errores

### URLs Importantes:
- API: `http://localhost:3000`
- Documentación: `http://localhost:3000/api-docs`
- Crear confirmación: `POST /boda/asistencia`
- Login: `POST /auth/login`
- Ver confirmaciones: `GET /boda/asistencia` (requiere token)

### Comandos Útiles:
```bash
npm run dev        # Modo desarrollo con hot-reload
npm run build      # Compilar TypeScript
npm start          # Iniciar en producción
npm run docs       # Generar documentación
```

---

## 📞 Soporte

Si tienes problemas:
1. Verifica que todas las dependencias estén instaladas
2. Confirma que el `.env` tenga las credenciales correctas
3. Revisa que la tabla en Supabase esté creada
4. Verifica los logs del servidor en la consola

¡Éxito con tu proyecto! 🎊
