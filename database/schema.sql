-- ASN441: creación y migración transaccional. Ejecutar con ON_ERROR_STOP=1.
-- Si hay carnets duplicados después de normalizar, la transacción se revierte.
BEGIN;
SET LOCAL lock_timeout = '10s';
CREATE TABLE IF NOT EXISTS estudiantes (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    carnet VARCHAR(30) NOT NULL,
    edad INTEGER NOT NULL,
    CONSTRAINT uk_estudiantes_carnet UNIQUE (carnet),
    CONSTRAINT chk_edad_rango CHECK (edad BETWEEN 0 AND 120),
    CONSTRAINT chk_nombres_no_vacios CHECK (btrim(nombres) <> ''),
    CONSTRAINT chk_apellidos_no_vacios CHECK (btrim(apellidos) <> ''),
    CONSTRAINT chk_carnet_no_vacios CHECK (btrim(carnet) <> '')
);
ALTER TABLE estudiantes ALTER COLUMN carnet TYPE VARCHAR(30);
ALTER TABLE estudiantes DROP CONSTRAINT IF EXISTS chk_edad_rango;
ALTER TABLE estudiantes ADD CONSTRAINT chk_edad_rango CHECK (edad BETWEEN 0 AND 120);
ALTER TABLE estudiantes DROP CONSTRAINT IF EXISTS chk_nombres_no_vacios;
ALTER TABLE estudiantes ADD CONSTRAINT chk_nombres_no_vacios CHECK (btrim(nombres) <> '');
ALTER TABLE estudiantes DROP CONSTRAINT IF EXISTS chk_apellidos_no_vacios;
ALTER TABLE estudiantes ADD CONSTRAINT chk_apellidos_no_vacios CHECK (btrim(apellidos) <> '');
ALTER TABLE estudiantes DROP CONSTRAINT IF EXISTS chk_carnet_no_vacios;
ALTER TABLE estudiantes ADD CONSTRAINT chk_carnet_no_vacios CHECK (btrim(carnet) <> '');

-- Igualar los carnets anteriores con la representación utilizada por la API.
UPDATE estudiantes SET carnet = upper(btrim(carnet))
WHERE carnet IS DISTINCT FROM upper(btrim(carnet));
-- También protege frente a inserciones directas con minúsculas o espacios.
CREATE UNIQUE INDEX IF NOT EXISTS ux_estudiantes_carnet_normalizado
ON estudiantes (upper(btrim(carnet)));
COMMENT ON TABLE estudiantes IS 'Estudiantes del proyecto ASN441';
COMMENT ON COLUMN estudiantes.carnet IS 'Texto de hasta 30 caracteres; API normaliza espacios exteriores y mayúsculas';
COMMENT ON COLUMN estudiantes.edad IS 'Edad entera entre 0 y 120';
COMMIT;
