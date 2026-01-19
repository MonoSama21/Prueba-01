-- ============================================
-- SETUP BASE DE DATOS - BODA DITER Y VIVIAN
-- ============================================
-- Ejecutar este script en AMBOS ambientes:
-- 1. Supabase DESARROLLO (boda-dev)
-- 2. Supabase PRODUCCIÓN (boda-prod)
-- ============================================

-- Crear tabla de confirmaciones de asistencia
CREATE TABLE confirmaciones_asistencia (
  id BIGSERIAL PRIMARY KEY,
  nombre_completo TEXT NOT NULL,
  correo_electronico TEXT NOT NULL,
  telefono TEXT,
  asistira BOOLEAN NOT NULL DEFAULT false,
  numero_invitados INTEGER NOT NULL DEFAULT 1,
  cancion_favorita TEXT,
  mensaje TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear índice para búsquedas por correo electrónico
CREATE INDEX idx_correo ON confirmaciones_asistencia(correo_electronico);

-- Crear función para actualizar automáticamente el campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger que ejecuta la función antes de cada UPDATE
CREATE TRIGGER update_confirmaciones_updated_at BEFORE UPDATE
ON confirmaciones_asistencia FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Deshabilitar Row Level Security (RLS)
-- ⚠️ NOTA: En producción, considera habilitar RLS con políticas adecuadas
ALTER TABLE confirmaciones_asistencia DISABLE ROW LEVEL SECURITY;

-- ============================================
-- DATOS DE PRUEBA (Solo para DESARROLLO)
-- ============================================
-- Ejecutar la siguiente sección SOLO en el ambiente de desarrollo
-- Comenta estas líneas si estás en producción

-- INSERT INTO confirmaciones_asistencia (nombre_completo, correo_electronico, telefono, asistira, numero_invitados, cancion_favorita, mensaje)
-- VALUES 
--   ('Juan Pérez', 'juan.perez@example.com', '+51987654321', true, 2, 'Bailando - Enrique Iglesias', 'Felicidades a los novios!'),
--   ('María García', 'maria.garcia@example.com', '+51987654322', true, 1, 'La Boda - Joaquín Sabina', 'Muy emocionada por su boda'),
--   ('Carlos Rodríguez', 'carlos.rodriguez@example.com', '+51987654323', false, 0, NULL, 'Lamentablemente no podré asistir');

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Ejecutar para verificar que todo se creó correctamente:
-- SELECT * FROM confirmaciones_asistencia;
-- SELECT COUNT(*) FROM confirmaciones_asistencia;
