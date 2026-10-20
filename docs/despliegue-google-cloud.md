# Entrega a Sarai — Google Cloud Run

No iniciar el laboratorio hasta que William confirme la integración con PostgreSQL
real, fotografías y escudo, y que el código definitivo esté publicado en GitHub.
Este documento prepara los pasos; NO indica que el despliegue esté realizado.

## Antes del laboratorio

- Node 24.19.x, `npm ci`, `npm test`, `npm run lint`, `npm run build` en frontend.
- API: https://asn-api-william.azurewebsites.net/api.
- Confirmar que GET, POST y DELETE funcionan con PostgreSQL real y persisten.
- Añadir las cinco fotos en frontend/public/images/team/.
- Confirmar que la suscripción temporal permite Cloud Run, Cloud Build, Artifact
  Registry y acceso público. Revisar tiempo, permisos, créditos y política del lab.
- Crear PR y comprobar los tres jobs de GitHub Actions, incluido contenedor.

## Prueba local de Docker (opcional si no está instalado)

Desde la raíz, PowerShell:

```powershell
docker build --build-arg VITE_API_BASE_URL=https://asn-api-william.azurewebsites.net/api -t asn-frontend:local frontend
docker run --rm --name asn-frontend-local -p 8080:8080 -e PORT=8080 asn-frontend:local
```

Abrir http://localhost:8080. Comprobar http://localhost:8080/healthz.
William debe autorizar http://localhost:8080 en CORS si se prueban peticiones reales.
En otra terminal: `docker stop asn-frontend-local` para terminar.
El job de CI prueba también PORT=9090, fallback SPA y archivo inexistente.

## Laboratorio: Cloud Shell (Bash)

No copiar los comandos Bash en PowerShell. Abrir Cloud Shell en el proyecto
asignado por el laboratorio. Usar el código definitivo de la rama acordada.
Si el repo es privado, usar autenticación interactiva o subir el ZIP; no poner
un token en la URL del repositorio ni en documentos.

```bash
# Desde la raíz de Proyect-ASN, que contiene cloudbuild.yaml y frontend/.
export ASN_PROJECT="ID_REAL_DEL_LAB"
export ASN_REGION="us-central1"
export ASN_TAG="v1"
gcloud config set project "$ASN_PROJECT"
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com

# Crear solo si todavía no existe. Si falta permiso, consultar al administrador del lab.
gcloud artifacts repositories list --location="$ASN_REGION"
gcloud artifacts repositories create asn-repo --repository-format=docker --location="$ASN_REGION" --description="Frontend ASN441"

# La URL de API se incorpora en el build. No es una variable secreta.
gcloud builds submit . --config=cloudbuild.yaml --substitutions="_REGION=$ASN_REGION,_TAG=$ASN_TAG,_API_URL=https://asn-api-william.azurewebsites.net/api"

gcloud run deploy asn-frontend --image="$ASN_REGION-docker.pkg.dev/$ASN_PROJECT/asn-repo/frontend:$ASN_TAG" --region="$ASN_REGION" --port=8080 --allow-unauthenticated --min-instances=0 --max-instances=2 --memory=256Mi

gcloud run services describe asn-frontend --region="$ASN_REGION" --format='value(status.url)'
```

Permisos requeridos dependen de la política y cuenta de servicio de Cloud Build.
Si el laboratorio bloquea una API, IAM o acceso público, guardar el error y consultar
al responsable; no cambiar roles al azar ni prometer despliegue público.

## CORS: William, en PowerShell con su sesión Azure

```powershell
$asnOrigenGoogle = "https://URL_REAL_DEL_SERVICIO.run.app"
az functionapp cors add --resource-group rg-proyect-asn --name asn-api-william --allowed-origins $asnOrigenGoogle
curl.exe -i -X OPTIONS https://asn-api-william.azurewebsites.net/api/estudiantes -H "Origin: $asnOrigenGoogle" -H "Access-Control-Request-Method: POST" -H "Access-Control-Request-Headers: content-type"
```

Usar solo el origen exacto, sin /api ni barra final. CORS no es autenticación.
No añadir credenciales al frontend. Probar desde la URL final y completar la matriz.

## Actualización y diagnóstico

Repetir build con un nuevo ASN_TAG (por ejemplo v2) y deploy de esa imagen.
Cambiar VITE_API_BASE_URL exige construir de nuevo; --set-env-vars en el contenedor
no modifica JavaScript ya compilado. Mantener la revisión anterior para rollback.

```bash
gcloud builds list --limit=5
gcloud run services logs read asn-frontend --region="$ASN_REGION" --limit=50
gcloud run revisions list --service=asn-frontend --region="$ASN_REGION"
```

Frontend 200 pero operaciones fallan: revisar Network, URL compilada, CORS y API.
API 500: William revisa configuración PG*, red y esquema con Gabriel.
Fallo de arranque: revisar PORT y logs. Fotografías 404: añadir archivos reales.

## Costos y cierre

Cloud Build, Artifact Registry y Cloud Run pueden consumir créditos. Escalar a cero
no elimina costos de almacenamiento de imágenes. Antes de retirar recursos,
confirmar con el equipo que terminó la demostración y no se necesitan evidencias.
Solo borrar los recursos de este proyecto, no otros del laboratorio.

```bash
gcloud run services delete asn-frontend --region="$ASN_REGION"
gcloud artifacts repositories delete asn-repo --location="$ASN_REGION"
```

## Referencias oficiales

- https://docs.cloud.google.com/run/docs/container-contract
- https://docs.cloud.google.com/build/docs/configuring-builds/substitute-variable-values
- https://docs.cloud.google.com/run/docs/deploying
