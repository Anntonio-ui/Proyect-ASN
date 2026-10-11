# Primeras tareas del equipo

Todos deben leer README.md y docs/contrato-api.md.

## Gabriel — Base de datos

Rama: feat/esquema-estudiantes
Revisor: William

- Crear database/schema.sql según el contrato.
- Crear database/seed.sql con estudiantes ficticios.
- Documentar ejecución en database/README.md.
- Preparar PostgreSQL en Azure, coordinando costos con William.
- Compartir credenciales por un medio seguro.

Terminado cuando las restricciones funcionan y William
puede conectar la API con PostgreSQL.

## Vanessa — Diseño

Rama: feat/interfaz-estudiantes
Revisora: Helen

- Usar la imagen lavanda aprobada como referencia.
- Crear layout, cabecera, menú y tarjetas.
- Crear tabla, formulario y confirmación de eliminación.
- Preparar estados de carga, vacío y error.
- Crear sección de integrantes y escudo del Barcelona.
- Acordar props y callbacks con Helen antes de integrar.

Trabajar principalmente en componentes y estilos.
No implementar llamadas a la API.

Terminado cuando la interfaz es adaptable y sus componentes
pueden recibir datos y eventos de Helen.

## Helen — Funcionalidad frontend

Rama: feat/integracion-estudiantes
Revisores: Vanessa y William

- Crear tipos de estudiante.
- Crear servicio de API y hook de estado.
- Implementar listado, registro y eliminación.
- Implementar búsqueda y estadísticas.
- Usar VITE_API_BASE_URL según el contrato.
- Trabajar con datos ficticios separados mientras falta la API.
- Coordinar los componentes con Vanessa.

Trabajar principalmente en types/, services/, hooks/ y utils/.
Coordinar cualquier cambio en App.tsx con Vanessa.

Terminado cuando las operaciones funcionan con la API real
y los cambios persisten en PostgreSQL.

## Sarai — Despliegue y pruebas

Rama: feat/despliegue-cloud-run
Revisor: William

- Revisar acceso, facturación y créditos de Google Cloud.
- Preparar Dockerfile y configuración del servidor web.
- Coordinar VITE_API_BASE_URL con Helen.
- Publicar frontend en Google Cloud Run.
- Comunicar el origen público a William para CORS.
- Documentar despliegue y pruebas integrales.

Terminado cuando la URL pública permite listar, registrar
y eliminar mediante la API de Azure.

## William — API y coordinación

Rama: feat/api-estudiantes
Revisor: Gabriel

- Implementar conexión PostgreSQL.
- Implementar los tres endpoints del contrato.
- Validar campos y manejar errores.
- Configurar CORS.
- Desplegar la API en Azure.
- Revisar integración y resolver bloqueos del equipo.

## Reglas comunes

- Una rama por tarea.
- Pull request hacia main.
- Revisar y comprobar antes de integrar.
- No subir secretos.
- Cada integrante documenta su módulo.
- No cambiar el contrato ni dependencias compartidas sin coordinar.
- Reportar bloqueos con el error exacto.