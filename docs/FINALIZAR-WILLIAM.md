# Pasos para William

## 1. Aplicar la actualización

Usar APLICAR.ps1 del paquete desde PowerShell. Solo acepta una copia limpia en
feat/integracion-final, valida el parche y no toca local.settings.json ni .env.local.
El script no crea commits ni realiza push. Revisar `git diff` después de aplicarlo.

## 2. Node y frontend

Actualizar Node a 24.19.x (la versión utilizada en CI y Docker). Abrir una nueva
terminal y comprobar `node --version`. No usar Node 22.16 con estas dependencias.

Desde la raíz:

```powershell
cd frontend
npm ci
# Copiar solo si aún no existe:
Copy-Item .env.example .env.local
npm test
npm run lint
npm run build
npm run dev
```

.env.example apunta a la API de Azure. Si .env.local ya existe, editar su
VITE_API_BASE_URL y reiniciar Vite. No contiene contraseña de PostgreSQL.
El sitio debe abrirse en http://localhost:5173, ya autorizado por CORS.

Una API sin PostgreSQL configurado mostrará error de listado. No es una lista vacía
ni debe sustituirse por datos falsos. La vista Equipo y los modales pueden revisarse.

## 3. Fotografías

Los cinco carnets originales ya están incluidos en frontend/public/images/team/:
william.jpg, gabriel.jpg, vanessa.jpg, helen.jpg, sarai.jpg.
Para cambiar nombres o roles, editar src/config/team.ts. El docente debe confirmar
los cinco integrantes porque el PDF original indica cuatro. El escudo ya está incluido.

## 4. PostgreSQL con Gabriel

Recibir host, base y usuario; contraseña por canal seguro. Corregir el esquema real
con database/schema.sql según database/README.md y ejecutar seed.sql si corresponde.
No repetir los scripts antiguos: fueron retirados.

Completar PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD y PGSSLMODE en
backend/local.settings.json, sin pegar secretos en el chat. Probar:

```powershell
cd ..\backend
.\.venv\Scripts\python.exe scripts/check_database.py
.\.venv\Scripts\python.exe -m unittest discover -s tests -v
```

Configurar las mismas variables PG* en Azure Portal > asn-api-william > Variables de
entorno. Conservar las variables de almacenamiento y el runtime existentes.
Gabriel debe permitir acceso de red y conceder permisos de lectura, inserción,
eliminación y uso de secuencia al usuario de la API. No desactivar SSL.

Para local: Azurite en una terminal, activar .venv y ejecutar func start en otra.
No iniciar dos procesos en el puerto 7071 ni dos Azurite en 10000.

## 5. Pruebas reales

```powershell
.\.venv\Scripts\python.exe scripts/test_integration.py --base-url https://asn-api-william.azurewebsites.net/api
```

Si solo lectura pasa, autorizar un registro ficticio creado y eliminado por el script:

```powershell
.\.venv\Scripts\python.exe scripts/test_integration.py --base-url https://asn-api-william.azurewebsites.net/api --write
```

El script no modifica otros registros. Si falla limpieza, informa el id a revisar.
Comprobar también desde el navegador: registrar, recargar, duplicar, buscar, cancelar,
eliminar y recargar. Completar docs/pruebas-integracion.md con evidencias reales.

## 6. Git y entrega a Sarai

Desde la raíz:

```powershell
git diff --check
git status
git add .
git diff --cached --name-only
```

Confirmar que no aparecen .env.local, local.settings.json ni credenciales.
Después:

```powershell
git commit -m "feat: completar interfaz e integracion para entrega"
git push -u origin feat/integracion-final
gh pr create --base main --head feat/integracion-final --title "Completar integracion del proyecto ASN" --body "Integra API, servicios frontend, interfaz completa y preparacion de Cloud Run. Ver docs/VALIDACION.md para resultados y pendientes reales."
gh pr checks feat/integracion-final --watch
```

Revisar los tres jobs: frontend, backend y contenedor. No declarar Docker comprobado
hasta que ese job pase. Coordinar el merge y cierre de PR #2, #7 y #8, cuyos commits
se incorporan a esta integración. No hacer merges adicionales por duplicado.

Cuando todo esté listo y las pruebas reales pasen, Sarai usa
`docs/despliegue-google-cloud.md`. William autoriza su origen exacto y juntos prueban
la URL final. No iniciar el laboratorio antes de esta entrega.
