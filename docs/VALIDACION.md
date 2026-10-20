# Validación de la actualización

## Ejecutado sobre el código de esta entrega

- npm ci: dependencias instaladas.
- npm run lint: aprobado.
- npm test: 62 pruebas aprobadas (59 de Helen y 3 de búsqueda/estadísticas).
- npm run build: aprobado, TypeScript y Vite.
- Backend: 17 pruebas aprobadas con acceso a datos simulado.
- Revisión visual en Chromium: dashboard, listado, equipo y formulario.
- Navegador de escritorio (1500 px) y móvil (390 px), con peticiones HTTP simuladas:
  - Resumen y gráficos con nueve estudiantes ficticios inyectados solo para la prueba.
  - Paginación y búsqueda ignorando tildes.
  - Campos obligatorios y carnet duplicado.
  - Creación y eliminación; cancelación de eliminación.
  - Carga de la sección de equipo y escudo.
  - Sin desbordamiento horizontal general en móvil; tabla con scroll interno.
  - Escape, contención de foco y restauración al cerrar diálogo.
  - Error, reintento y listado vacío.
  - Sin errores JavaScript de página durante esos flujos.

Los datos simulados NO forman parte de la aplicación entregada. La interfaz siempre
usa la API configurada. Actualización de carnets: se incluyen las cinco imágenes originales entregadas por William, sin recorte ni alteración de sus bytes.

Entorno de verificación: Node 24.19.0, Python 3.12 local. El runtime del proyecto y
el workflow del backend permanecen en Python 3.11, ya probado previamente por William.

## Preparado, pero NO ejecutado en este entorno

- Docker build y arranque: no hay Docker instalado. Se añadió un job de CI que debe
  construir y comprobar PORT dinámico, /healthz, fallback y assets inexistentes.
- Migración SQL en PostgreSQL: no hay servidor ni credenciales de Gabriel disponibles.
- scripts/check_database.py y scripts/test_integration.py con Azure real: pendientes.
- Despliegue Google Cloud: pendiente del laboratorio de Sarai.
- Carnets: archivos incluidos; verificar correspondencia y legibilidad final con el equipo.

No considerar el proyecto listo para la demostración final hasta completar esos
puntos y la matriz de pruebas de integración.

## Comprobación adicional de carnets

Cinco imágenes cargadas en Chromium, object-fit contain, ampliación en escritorio,
Escape y vista móvil sin desbordamiento. Lint y build aprobados después del cambio.
