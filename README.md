# Proyect-ASN

Proyecto universitario ASN441 para listar, registrar
y eliminar estudiantes.

## Tecnologías

- Frontend: React, Vite, TypeScript y Tailwind CSS.
- Iconos: Lucide React.
- API: Python con Azure Functions.
- Base de datos: PostgreSQL en Azure.
- Frontend publicado en Google Cloud Run.

## Equipo

| Integrante | Responsabilidad | Revisor |
|---|---|---|
| William | API, coordinación e integración | Gabriel |
| Gabriel | PostgreSQL y configuración en Azure | William |
| Vanessa | Diseño y componentes visuales | Helen |
| Helen | Funcionalidad frontend y consumo de API | Vanessa y William |
| Sarai | Google Cloud Run y pruebas integrales | William |

## Estructura

- frontend/: aplicación React.
- backend/: API de Azure Functions.
- database/: scripts e instrucciones de PostgreSQL.
- docs/: contrato, tareas, despliegue y pruebas.

## Ejecutar el frontend

Desde la raíz:

    cd frontend
    npm ci
    Copy-Item .env.example .env.local
    npm run dev

La página provisional permite comprobar la instalación.
El diseño final lo implementará Vanessa.

La API todavía está en implementación.
Configurar su dirección no significa que ya esté disponible.

## Comprobaciones del frontend

    npm run build
    npm run lint

## Contrato de API

Consultar docs/contrato-api.md antes de implementar
la base de datos o el consumo de API.

## Diseño aprobado

Dashboard lavanda pastel basado en la imagen de referencia
compartida por William.

Vanessa mantiene los estilos y componentes visuales.
Helen mantiene servicios, hooks y operaciones.

Ambas deben acordar las props y callbacks de los componentes.

## Flujo de trabajo

1. Actualizar main antes de empezar una tarea.
2. Crear una rama por tarea.
3. Implementar y comprobar los cambios.
4. Crear commits descriptivos.
5. Subir la rama.
6. Abrir un pull request hacia main.
7. Solicitar revisión antes de integrar.

No trabajar directamente sobre main.
No sobrescribir cambios de otros integrantes.

## Configuración y secretos

- No subir contraseñas ni cadenas de conexión reales.
- No subir .env.local, local.settings.json ni entornos virtuales.
- Las variables VITE_* son públicas en el navegador.
- Los archivos de ejemplo contienen únicamente valores ficticios.

## Estado inicial

- Frontend creado y compilación comprobada por William.
- Contrato de API documentado.
- API, base de datos y despliegue pendientes.