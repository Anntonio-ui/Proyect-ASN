-- ============================================================
-- Proyecto Universitario ASN441
-- Modulo: Base de Datos PostgreSQL
-- Archivo: seed.sql
-- Responsable: Gabriel
-- ============================================================

INSERT INTO estudiantes (nombres, apellidos, carnet, edad)
VALUES 
    ('Carlos Eduardo', 'Gómez Hernández', 'GH202601', 21),
    ('María Fernanda', 'López Ramírez', 'LR202602', 19),
    ('José Luis', 'Martínez Rivas', 'MR202603', 23),
    ('Ana Lucía', 'Torres Castro', 'TC202604', 20)
ON CONFLICT (carnet) DO NOTHING;