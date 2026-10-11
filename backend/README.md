# API — Proyect-ASN

Responsable: William.

Tecnologías:
- Python 3.11.
- Azure Functions Core Tools v4.
- Psycopg 3.
- PostgreSQL.

## Preparación local

Ejecutar desde backend:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item local.settings.example.json local.settings.json
```

Copiar la configuración únicamente si local.settings.json
todavía no existe. No sobrescribir credenciales existentes.

Si PowerShell bloquea la activación:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\.venv\Scripts\Activate.ps1
```

## Almacenamiento local

Instalar Azurite una vez:

```powershell
npm install -g azurite
```

Ejecutarlo en una terminal independiente:

```powershell
azurite --location "$env:TEMP\Proyect-ASN-azurite"
```

Si ya está ejecutándose, no iniciar otra instancia.

En local.settings.json:

```json
"AzureWebJobsStorage": "UseDevelopmentStorage=true"
```

Este valor es para desarrollo local.
Azure utilizará almacenamiento real.

## Iniciar API

Con el entorno virtual activado:

```powershell
func start
```

Mantener una sola instancia en el puerto 7071.

## Endpoints

| Método | Ruta | Función |
|---|---|---|
| GET | /api/health | Comprobar que la API responde |
| GET | /api/estudiantes | Listar |
| POST | /api/estudiantes | Registrar |
| DELETE | /api/estudiantes/{id} | Eliminar |

Consultar ../docs/contrato-api.md.

Health no comprueba PostgreSQL.

## PostgreSQL

Completar únicamente en la configuración local o en Azure:
- PGHOST
- PGPORT
- PGDATABASE
- PGUSER
- PGPASSWORD
- PGSSLMODE

El código espera una tabla estudiantes con:
id, nombres, apellidos, carnet y edad.

Gabriel prepara el esquema según el contrato.
El carnet debe tener una restricción de unicidad.

Las consultas usan parámetros.
Las operaciones de escritura confirman la transacción
cuando terminan correctamente.

## Pruebas automatizadas

Desde backend:

```powershell
.\.venv\Scripts\python.exe -m unittest discover -s tests -v
```

Resultado comprobado por William: 17 pruebas aprobadas.

Incluyen validaciones y respuestas de endpoints.
Las pruebas de endpoints simulan el acceso a datos;
no comprueban las consultas ni la conexión PostgreSQL.

## Pruebas HTTP realizadas

- Campos incompletos: 400 DATOS_INVALIDOS.
- JSON mal formado: 400 JSON_INVALIDO.
- ID inválido: 400 DATOS_INVALIDOS.
- Health: 200 con status ok.

## Pendiente de integración

- Conexión con PostgreSQL real.
- Listado, registro y eliminación persistentes.
- Carnet duplicado contra la base real.
- Despliegue en Azure.
- CORS con el origen de Google Cloud Run.
- Integración con el frontend.

## Seguridad

No subir local.settings.json, .venv ni credenciales.

La API está configurada con acceso anónimo.
No registrar estudiantes reales en una publicación abierta
sin acordar primero el control de acceso.

Los errores HTTP internos no exponen detalles técnicos.