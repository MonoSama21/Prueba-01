import FormularioModel from "../models/formularioModel";
import { ApiResponse, ConfirmacionAsistencia } from '../types';
import { Request, Response } from 'express';

class FormularioController {

  // ============================================
  // MÉTODOS PARA CONFIRMACIONES DE ASISTENCIA
  // ============================================

    static async crearConfirmacion(req: Request, res: Response): Promise<void> {
        try {
            const datos: Omit<ConfirmacionAsistencia, 'id' | 'created_at' | 'updated_at'> = req.body;
            
            //VALIDACIONES->STATUS CODE 400

            // 1. VERFIFICAR QUE NO SE ENVIE UN REQUEST VACIO
            if (!datos || Object.keys(datos).length === 0) {
                res.status(400).json({ 
                    success: false, 
                    message: 'El cuerpo de la solicitud no puede estar vacío' 
                } as ApiResponse);
                return;
            }

            // 2. VERIFICAR CAMPOS FALTANTES-REQUERIDOS -> CONVERSAR CON EL CLIENTE QUE CAMPOS DESEA QUE SEAN OBLIGATORIOS
            const camposRequeridos = ['nombre_completo', 'correo_electronico', 'asistira', 'numero_invitados'];
            const camposFaltantes = camposRequeridos.filter(campo => !(campo in datos));

            if (camposFaltantes.length > 0) {
                res.status(400).json({ 
                    success: false,
                    message: `Faltan los siguientes campos requeridos: ${camposFaltantes.join(', ')}`
                } as ApiResponse);
                return;
            }

            // 3. VERRIFICAR FORMATO DE CORREO ELECTRONICO
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(datos.correo_electronico)) {
                res.status(400).json({
                success: false,
                message: 'El formato del correo electrónico no es válido'
                } as ApiResponse);
                return;
            }

            // CASO EXITOSO-> STATUS CODE 201
            const resultado = await FormularioModel.crearConfirmacion(datos);
            res.status(201).json({ 
                success: true, 
                message: 'Confirmación de asistencia creada exitosamente',
                data: resultado.data
            } as ApiResponse);

        } catch (error: any) {
            //CUANDO HAY ERROR DEL SERVIDOR 
            console.error('Error en el controlador:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error interno del servidor', 
                error: error.message 
            } as ApiResponse);
        }
    }

    static async obtenerTodasConfirmaciones(req: Request, res: Response): Promise<void> {
    try {
        const resultado = await FormularioModel.obtenerTodasConfirmaciones();

        if (!resultado.success) {
            res.status(500).json({
            success: false,
            message: 'Error al obtener los datos',
            error: resultado.error
            } as ApiResponse);
            return;
        }

        res.status(200).json({
            success: true,
            data: resultado.data
        } as ApiResponse<ConfirmacionAsistencia[]>);

        } catch (error: any) {
        console.error('Error en el controlador:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        } as ApiResponse);
        } 
    }         



}

export default FormularioController;