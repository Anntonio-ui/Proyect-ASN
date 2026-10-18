-- ============================================================
-- Proyecto Universitario ASN441
-- Modulo: Base de Datos PostgreSQL
-- Archivo: schema.sql
-- Responsable: Gabriel
-- ============================================================

CREATE TABLE IF NOT EXISTS estudiantes (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    carnet VARCHAR(20) NOT NULL,
    edad INT NOT NULL,
    
    -- Restricciones de Integridad (Constraints)
    CONSTRAINT uk_estudiantes_carnet UNIQUE (carnet),
    CONSTRAINT chk_edad_rango CHECK (edad >= 15 AND edad <= 100),
    CONSTRAINT chk_nombres_no_vacios CHECK (TRIM(nombres) <> ''),
    CONSTRAINT chk_apellidos_no_vacios CHECK (TRIM(apellidos) <> ''),
    CONSTRAINT chk_carnet_no_vacios CHECK (TRIM(carnet) <> '')
);

-- Comentarios de documentacion en base de datos
COMMENT ON TABLE estudiantes IS 'Tabla principal de estudiantes para el proyecto ASN441';
COMMENT ON COLUMN estudiantes.id IS 'Identificador unico autoincremental (Clave Primaria)';
COMMENT ON COLUMN estudiantes.nombres IS 'Nombres del estudiante';
COMMENT ON COLUMN estudiantes.apellidos IS 'Apellidos del estudiante';
COMMENT ON COLUMN estudiantes.carnet IS 'Carnet institucional unico (almacenado como texto)';
COMMENT ON COLUMN estudiantes.edad IS 'Edad del estudiante en años enteros (15 - 100)';