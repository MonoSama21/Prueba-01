import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import formularioRoutes from './routes/formularioRoutes';
import authRoutes from './routes/authRoutes';

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
    }
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
});
