import supabase from '../config/supabase';

// Seleccionar tabla según el ambiente
const tableName = process.env.NODE_ENV === 'production' 
  ? 'confirmaciones_asistencia' 
  : 'confirmaciones_asistencia_dev';

/**
 * Mantiene la conexión con Supabase activa
 * Hace ping cada 5 minutos para evitar hibernación
 */
export const mantenerSupabaseActivo = () => {
  console.log('🔄 Iniciando servicio Keep-Alive para Supabase...');
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📋 Tabla activa: ${tableName}`);
  
  // Hacer ping inmediatamente al iniciar
  hacerPing();
  
  // Configurar intervalo de 5 minutos
  setInterval(() => {
    hacerPing();
  }, 5 * 60 * 1000); // 5 minutos en milisegundos
};

/**
 * Función que hace ping a Supabase
 */
const hacerPing = async () => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('❌ Error en ping a Supabase:', error.message);
    } else {
      console.log(`✅ Ping a Supabase exitoso - ${new Date().toLocaleTimeString('es-ES')}`);
    }
  } catch (error: any) {
    console.error('❌ Error crítico en ping a Supabase:', error.message);
  }
};