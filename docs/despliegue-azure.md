# Despliegue de API en Azure

## Recursos

- Suscripción: Azure for Students.
- Grupo: rg-proyect-asn.
- Región: East US.
- Function App: asn-api-william.
- Plan: Flex Consumption.
- Runtime: Python 3.11.
- Memoria: 512 MB.
- Always Ready: sin instancias configuradas.
- Storage: asnf704bb4937584c9c9b.
- Application Insights: asn-api-william.

Los recursos pueden consumir créditos de la suscripción.

## URL base

https://asn-api-william.azurewebsites.net/api

Helen debe configurar esta dirección como VITE_API_BASE_URL.
Sarai debe incorporarla al construir el frontend para producción.

Las variables VITE_* son públicas; no deben contener secretos.

## Publicar actualizaciones

Desde backend, con el entorno virtual activado:

```powershell
python -m unittest discover -s tests -v
func azure functionapp publish asn-api-william --build remote
```

Publicar solamente si las pruebas pasan.

No usar --publish-local-settings.
La configuración de Azure se administra por separado.

.funcignore excluye el entorno virtual, configuración local
y pruebas del paquete de despliegue.

## Verificación realizada — 11 de octubre de 2026

- Despliegue remoto exitoso.
- Tres funciones detectadas: health, students y remove_student.
- GET /api/health: 200 con status ok.
- POST /api/estudiantes con {}: 400 DATOS_INVALIDOS.
- DELETE /api/estudiantes/abc: 400 DATOS_INVALIDOS.
- 17 pruebas locales aprobadas con acceso a datos simulado.

Estas verificaciones no demuestran conexión con PostgreSQL.

## Pendiente

- Configurar variables PG* con la base de Gabriel.
- Probar operaciones y persistencia con PostgreSQL real.
- Configurar CORS para frontend local y origen de Google Cloud Run.
- Probar integración desde el navegador.
- Revisar e integrar el PR de la API.

## Configuración local y producción

UseDevelopmentStorage=true corresponde únicamente a Azurite local.
No establecer ese valor en Azure.

No guardar credenciales en GitHub ni en esta documentación.