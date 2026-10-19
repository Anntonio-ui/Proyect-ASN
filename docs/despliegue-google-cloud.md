# Guía de Despliegue en Google Cloud Run

**Responsable:** Sarai (Google Cloud Run y Pruebas Integrales)

---

## 1. Requisitos del Laboratorio
* Proyecto de Google Cloud activado.
* APIs activadas: `run.googleapis.com`, `artifactregistry.googleapis.com`.
* Google Cloud SDK (`gcloud` CLI) o Google Cloud Shell.

---

## 2. Variables y Marcadores
* **ID de Proyecto GCP:** `[PROJECT_ID_LAB]` (Marcador)
* **Región GCP:** `[REGION_GCP]` (Ejemplo: `us-central1`)
* **Nombre de Servicio Cloud Run:** `asn-frontend`
* **URL API Azure:** `https://asn-api-william.azurewebsites.net/api`

---

## 3. Comandos de Construcción y Despliegue

```bash
# Autenticación y proyecto
gcloud auth login
gcloud config set project [PROJECT_ID_LAB]

# Crear repositorio en Artifact Registry
gcloud artifacts repositories create asn-repo \
    --repository-format=docker \
    --location=[REGION_GCP] \
    --description="Repositorio Docker ASN"

# Construcción de imagen en la nube
gcloud builds submit --tag [REGION_GCP]-docker.pkg.dev/[PROJECT_ID_LAB]/asn-repo/frontend:v1 ./Interfaz

# Despliegue en Cloud Run
gcloud run deploy asn-frontend \
    --image [REGION_GCP]-docker.pkg.dev/[PROJECT_ID_LAB]/asn-repo/frontend:v1 \
    --platform managed \
    --region [REGION_GCP] \
    --allow-unauthenticated \
    --port 8080 \
    --set-env-vars VITE_API_BASE_URL=[https://asn-api-william.azurewebsites.net/api](https://asn-api-william.azurewebsites.net/api)
