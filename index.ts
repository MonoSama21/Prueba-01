import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import formularioRoutes from './routes/formularioRoutes';
import authRoutes from './routes/authRoutes';
import { mantenerSupabaseActivo } from './services/keepAliveService';
import supabase from './config/supabase';

dotenv.config();

// Crear la aplicación Express
const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

// Middlewares
app.use(cors()); // Permitir peticiones desde cualquier origen
app.use(bodyParser.json()); // Parsear JSON en el body
app.use(bodyParser.urlencoded({ extended: true })); // Parsear datos de formularios


// Ruta de bienvenida
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'API para la confirmación de asistencia a la boda de Diter y Vivian',
    version: '2.0.0',
    endpoints: {
      crear: 'POST /boda/asistencia',
      obtenerTodas: 'GET /boda/asistencia (🔒 Requiere autenticación)',
      login: 'POST /auth/login',
      documentacion: 'GET /api-docs'
    },
    status: {
      supabase: 'Activo con Keep-Alive cada 5 minutos ⏰'
    }
  });
});

// Health check (para keep-alive)
app.get('/health', (req: Request, res: Response) => {
  const uptime = process.uptime();
  const uptimeMinutos = Math.floor(uptime / 60);
  
  res.status(200).json({
    status: 'OK',
    message: 'El servidor está funcionando correctamente',
    timestamp: new Date().toISOString(),
    uptime: {
      segundos: Math.floor(uptime),
      minutos: uptimeMinutos,
      horas: Math.floor(uptimeMinutos / 60)
    },
    ambiente: process.env.NODE_ENV
  });
});


// Rutas de la API
app.use('/auth', authRoutes);
app.use('/boda/asistencia', formularioRoutes);

// Manejo de rutas no encontradas
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Manejo de errores
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: err.message
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor TypeScript corriendo en http://localhost:${PORT}`);
  console.log(`📋 Endpoints disponibles en http://localhost:${PORT}/boda/asistencia`);
  console.log(`⏰ Keep-Alive de Supabase activado (ping cada 5 minutos)`);
  // Activar el servicio Keep-Alive
  mantenerSupabaseActivo();
});
