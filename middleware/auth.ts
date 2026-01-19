import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Le dice a TypeScript: "Oye, las peticiones ahora pueden tener un campo user con el nombre de usuario"
declare global {
  namespace Express {
    interface Request {
      user?: { username: string };
    }
  }
}

export const verificarToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers['authorization'];  // EN LAS PETICIONES HTTP BUSCA EL BEARER TOKEN
    const token = authHeader && authHeader.split(' ')[1]; // OBTIENE EL TOKEN

    //VALIDACIONES 
    // 1. SI NO HAY TOKEN RESPONDE "ACCESO DENEGADO"
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
    //2. SI EL TOKEN EXPIRO (PASARON MAS DE 24 HORAS) 
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        message: 'El token ha expirado. Por favor, inicie sesión nuevamente.',
      });
      return;
    }
    //3. CUALQUIER OTRO ERROR RESPONDE "TOKEN INVALIDO O CORRUPTO"
    res.status(403).json({
      success: false,
      message: 'Token inválido o corrupto.',
    });
  }
};

//ACA REVISA QUE EL TOKEN JWT SEA VALIDO ANTES DE DEJAR PASAR LA PETICION