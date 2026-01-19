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