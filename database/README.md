# PostgreSQL — ASN441

Responsable inicial: Gabriel. Integración: William.

## Archivos definitivos

- `schema.sql`: creación y migración en una transacción, sin borrar registros.
- `seed.sql`: cuatro estudiantes ficticios; se puede repetir sin duplicar sus carnets.

Desde la raíz, con psql instalado (PowerShell):

```powershell
$env:PGSSLMODE = "require"
psql -h HOST_DE_GABRIEL -U USUARIO -d BASE_DE_DATOS -v ON_ERROR_STOP=1 -f database/schema.sql
psql -h HOST_DE_GABRIEL -U USUARIO -d BASE_DE_DATOS -v ON_ERROR_STOP=1 -f database/seed.sql
```

psql solicita la contraseña cuando sea necesaria. No escribirla en comandos ni subirla.
No ejecutar sobre otra base de datos ni borrar tablas para solucionar migraciones.

El esquema establece carnet de hasta 30 caracteres y edad de 0 a 120. Se conservan
ceros iniciales. La API normaliza a mayúsculas. Un índice protege la unicidad sin
importar mayúsculas o espacios exteriores.

Si existen datos anteriores, respaldar primero. La migración normaliza los carnets;
si encuentra duplicados o datos inválidos, debe corregirlos el responsable antes de
reintentar. La transacción revierte los cambios cuando falla una instrucción.

## Verificación

En psql:

```sql
\d estudiantes
SELECT id, nombres, apellidos, carnet, edad FROM estudiantes ORDER BY id;
SELECT carnet, COUNT(*) FROM estudiantes GROUP BY carnet HAVING COUNT(*) > 1;
```

Configurar el usuario de aplicación con SELECT, INSERT, DELETE sobre estudiantes
y USAGE sobre la secuencia de identidad. No necesita permisos de administración.
El propietario ejecuta las migraciones. Coordinar nombres de roles con Gabriel.

## Datos pendientes de entregar

Host, puerto, base, usuario y contraseña por canal seguro, además del acceso de red
para la computadora y Azure Functions. La presencia de estos scripts NO demuestra
que PostgreSQL esté desplegado ni que las operaciones se hayan comprobado.
