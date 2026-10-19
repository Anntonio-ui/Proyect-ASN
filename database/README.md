# Módulo de Base de Datos - ASN441

**Responsable:** Gabriel  
**Tecnología:** PostgreSQL (Azure Database for PostgreSQL)

## Estructura del Módulo
- `schema.sql`: Script DDL para la creación de la tabla `estudiantes`, restricciones de integridad (carnet único, textos no vacíos, rango de edad de 0 a 120) y migración segura (`ALTER TABLE`).
- `seed.sql`: Datos ficticios iniciales de prueba (idempotentes mediante `ON CONFLICT`).

## Instrucciones de Ejecución

1. Conéctate a tu instancia de PostgreSQL en Azure utilizando tu cliente preferido (pgAdmin, DBeaver, VS Code Extension o psql).
2. Selecciona o crea la base de datos del proyecto.
3. Ejecuta el script de esquema para crear o actualizar la tabla sin perder datos:
   ```bash
   psql -h <tu-servidor>.postgres.database.azure.com -U <usuario> -d <nombre-bd> -f database/schema.sql