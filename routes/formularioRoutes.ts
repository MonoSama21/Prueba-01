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