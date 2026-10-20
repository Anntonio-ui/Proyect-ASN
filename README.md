# 🎓 Proyect-ASN · Gestión de estudiantes

Portal académico con diseño lavanda, listado, registro y eliminación de estudiantes.
Frontend React en Google Cloud Run; API Python y PostgreSQL en Azure.

## Equipo

| Integrante | Responsabilidad |
|---|---|
| William | Liderazgo, API e integración final |
| Gabriel | Base de datos PostgreSQL |
| Vanessa | Base visual y diseño |
| Helen | Servicios, hook y pruebas del frontend |
| Sarai | Preparación y despliegue en Google Cloud Run |

## Inicio rápido (PowerShell)

Requisitos: Node **24.19.x**, npm, Python 3.11 y Git. Docker es opcional para comprobar
el contenedor localmente; CI incluye una prueba de construcción y arranque.

```powershell
cd frontend
npm ci
# Solo si no existe .env.local:
Copy-Item .env.example .env.local
npm run dev
```

Abrir http://localhost:5173. La interfaz usa VITE_API_BASE_URL (Azure en el ejemplo).
Si PostgreSQL no está conectado, muestra un error real y permite reintentar.
No hay base de datos simulada ni persistencia local oculta.

## Verificación

En frontend:

```powershell
npm run lint
npm test
npm run build
```

Backend: ver backend/README.md; ejecutar sus pruebas desde backend con .venv.
El workflow comprueba frontend, backend y contenedor. Ver docs/VALIDACION.md para
resultados de esta entrega y límites de las pruebas.

## Funciones

- Resumen con total, edad promedio y gráficos por rangos de edad calculados.
- Listado con búsqueda por nombres, apellidos y carnet y paginación.
- Formulario con validación y errores de API; conserva datos si falla.
- Confirmación de eliminación y prevención de doble envío.
- Carga, error con reintento, lista vacía y búsqueda sin coincidencias.
- Equipo configurable con cinco carnets originales completos y escudo del Barcelona.
- Diseño adaptable y diálogos con navegación por teclado.

## Documentación

- **docs/FINALIZAR-WILLIAM.md**: pasos para aplicar y terminar la integración real.
- docs/contrato-api.md: campos, validaciones y respuestas.
- database/README.md: esquema definitivo y migración.
- docs/despliegue-google-cloud.md: entrega a Sarai, antes y durante el laboratorio.
- docs/pruebas-integracion.md: aceptación final con evidencias pendientes.

## Estructura

frontend/ · backend/ · database/ · docs/ · .github/workflows/

## Pendientes que necesitan recursos externos

1. Verificar visualmente los cinco carnets incluidos en frontend/public/images/team/.
2. Conexión PostgreSQL de Gabriel y ejecución del esquema corregido.
3. Pruebas HTTP y persistencia con Azure real.
4. Aprobar integración; iniciar lab, desplegar y autorizar CORS de Cloud Run.

El PDF original menciona cuatro integrantes; William debe confirmar el equipo de cinco.
El acceso de API es anónimo: usar datos ficticios para la demostración pública.
No existe login ni subida de fotos de estudiantes en el alcance.

## Colaboración

Una rama por tarea y pull requests revisados. La integración final reúne los commits
de las entregas; coordinar su merge sin duplicar PR. Cada integrante documenta su parte.
No subir .env.local, local.settings.json, entornos virtuales ni credenciales.
Las variables VITE_* quedan visibles en el navegador. CORS no sustituye autenticación.
