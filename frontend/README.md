# Frontend ASN441

React 19, Vite 6, TypeScript y Tailwind CSS 4. Node 24.19.x.

Desde esta carpeta: npm ci, copiar .env.example a .env.local solo si no existe,
y npm run dev. Para verificar: npm run lint, npm test y npm run build.

- components/layout: estructura original de Vanessa.
- components/dashboard: estadísticas reales y visualización.
- components/students: tabla y formulario.
- components/team: integrantes y escudo.
- components/ui: diálogo nativo accesible.
- hooks/useStudents: lógica de Helen, reutilizada para todas las operaciones.
- services/studentsApi: único acceso a la API.
- utils/studentStats: búsqueda y cálculos; studentValidation: validación.

La integración de App.tsx mantiene una sola instancia del hook y comparte el estado.
Los cinco carnets originales y el escudo están incluidos en public/images/. Los carnets se muestran completos y se pueden ampliar.
No hay modo demo en producción. Los mocks existen únicamente en pruebas.

Leer ../docs/FINALIZAR-WILLIAM.md y ../docs/despliegue-google-cloud.md.
