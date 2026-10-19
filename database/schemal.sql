-- ============================================================
-- Proyecto Universitario ASN441
-- Módulo: Base de Datos PostgreSQL
-- Archivo: schema.sql
-- Responsable: Gabriel
-- ============================================================

-- 1. Crear la tabla si no existe (creación inicial)
CREATE TABLE IF NOT EXISTS estudiantes (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    carnet VARCHAR(30) NOT NULL,
    edad INT NOT NULL,
    
    -- Restricciones de Integridad (Constraints)
    CONSTRAINT uk_estudiantes_carnet UNIQUE (carnet),
    CONSTRAINT chk_edad_rango CHECK (edad >= 0 AND edad <= 120),
    CONSTRAINT chk_nombres_no_vacios CHECK (TRIM(nombres) <> ''),
    CONSTRAINT chk_apellidos_no_vacios CHECK (TRIM(apellidos) <> ''),
    CONSTRAINT chk_carnet_no_vacios CHECK (TRIM(carnet) <> '')
);

-- 2. Migración / Ajustes si la tabla ya existía previamente (sin perder datos)
-- Ampliar carnet a VARCHAR(30) si era de menor tamaño
ALTER TABLE estudiantes ALTER COLUMN carnet TYPE VARCHAR(30);

-- Actualizar o asegurar la restricción de rango de edad (0 a 120)
ALTER TABLE estudiantes DROP CONSTRAINT IF EXISTS chk_edad_rango;
ALTER TABLE estudiantes ADD CONSTRAINT chk_edad_rango CHECK (edad >= 0 AND edad <= 120);

-- Asegurar restricciones de texto no vacío por si acaso
ALTER TABLE estudiantes DROP CONSTRAINT IF EXISTS chk_nombres_no_vacios;
ALTER TABLE estudiantes ADD CONSTRAINT chk_nombres_no_vacios CHECK (TRIM(nombres) <> '');

ALTER TABLE estudiantes DROP CONSTRAINT IF EXISTS chk_apellidos_no_vacios;
ALTER TABLE estudiantes ADD CONSTRAINT chk_apellidos_no_vacios CHECK (TRIM(apellidos) <> '');

ALTER TABLE estudiantes DROP CONSTRAINT IF EXISTS chk_carnet_no_vacios;
ALTER TABLE estudiantes ADD CONSTRAINT chk_carnet_no_vacios CHECK (TRIM(carnet) <> '');

-- Comentarios de documentación en base de datos
COMMENT ON TABLE estudiantes IS 'Tabla principal de estudiantes para el proyecto ASN441';
COMMENT ON COLUMN estudiantes.id IS 'Identificador único autoincremental (Clave Primaria)';
COMMENT ON COLUMN estudiantes.nombres IS 'Nombres del estudiante';
COMMENT ON COLUMN estudiantes.apellidos IS 'Apellidos del estudiante';
COMMENT ON COLUMN estudiantes.carnet IS 'Carnet institucional único almacenado como texto (hasta 30 chars, normalizado a mayúsculas por API)';
COMMENT ON COLUMN estudiantes.edad IS 'Edad del estudiante en años enteros, rango válido entre 0 y 120';