import supabase from '../config/supabase';

// Seleccionar tabla según el ambiente
const tableName = process.env.NODE_ENV === 'production' 
  ? 'confirmaciones_asistencia' 
  : 'confirmaciones_asistencia_dev';

let contadorPings = 0;

/**
 * Mantiene la conexión con Supabase activa y evita que Render duerma el servidor
 */
export const mantenerSupabaseActivo = () => {
  console.log('🔄 Iniciando servicio Keep-Alive...');
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📋 Tabla activa: ${tableName}`);
  console.log(`⏱️  Ping a Supabase: cada 5 minutos`);
  console.log(`⏱️  Ping al servidor: cada 14 minutos`);
  
  // Hacer ping a Supabase inmediatamente
  hacerPingSupabase();
  
  // Hacer ping al servidor después de 1 minuto
  setTimeout(hacerPingServidor, 60000);
  
  // Configurar intervalos
  setInterval(hacerPingSupabase, 5 * 60 * 1000); // 5 minutos
  setInterval(hacerPingServidor, 14 * 60 * 1000); // 14 minutos
};

/**
 * Ping a Supabase para mantener la conexión
 */
const hacerPingSupabase = async () => {
  try {
    contadorPings++;
    const { data, error } = await supabase
      .from(tableName)
      .select('id')
      .limit(1);
    
    if (error) {
      console.error(`❌ Ping #${contadorPings} a Supabase FALLÓ:`, error.message);
    } else {
      console.log(`✅ Ping #${contadorPings} a Supabase exitoso - ${new Date().toLocaleTimeString('es-PE')}`);
      console.log(`   └─ Uptime: ${Math.floor(process.uptime() / 60)} minutos`);
    }
  } catch (error: any) {
    console.error(`💥 Error crítico en ping #${contadorPings}:`, error.message);
  }
};

/**
 * Ping HTTP al servidor para evitar que Render lo duerma
 */
const hacerPingServidor = async () => {
  // En desarrollo usa localhost, en producción usa la URL de Render
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const port = process.env.PORT || '3000';
  const url = isDevelopment 
    ? `http://localhost:${port}`
    : (process.env.RENDER_EXTERNAL_URL || 'https://boda-diter-vivian-prod-hlaj.onrender.com');
  
  try {
    const response = await fetch(`${url}/health`);
    
    if (response.ok) {
      console.log(`🌐 Ping HTTP al servidor exitoso - Status: ${response.status}`);
    } else {
      console.warn(`⚠️  Ping HTTP respondió con status: ${response.status}`);
    }
  } catch (error: any) {
    console.error('❌ Error en ping HTTP al servidor:', error.message);
  }
};