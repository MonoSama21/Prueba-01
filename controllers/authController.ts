import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      // Extrae username y password del body de la petición
      // Si falta alguno → responde "Usuario y contraseña son requeridos" (400)
      if (!username || !password) {
        res.status(400).json({
          success: false,
          message: 'Usuario y contraseña son requeridos',
        });
        return;
      }
      // Carga las credenciales del archivo .env
      // Los valores después de || son solo fallbacks (por si falta el .env)
      const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'diter-vivian';
      const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'BodaDyV2026!';
      const JWT_SECRET = process.env.JWT_SECRET || 'tu-secreto-super-seguro-cambiar-en-produccion';
      
      // Compara las credenciales recibidas con las del .env
      if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
        res.status(401).json({
          success: false,
          message: 'Usuario o contraseña incorrectos',
        });
        return;
      }
      // Si las credenciales son correctas, genera un token JWT válido por 24 horas
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

//Usuario envía diter-vivian + BodaDyV2026!
//Se compara con los valores del .env
//Si coinciden → genera token JWT válido por 24h
//Devuelve el token al usuario
//Usuario usa ese token para acceder a endpoints protegidos