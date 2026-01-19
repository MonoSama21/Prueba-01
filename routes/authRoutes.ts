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