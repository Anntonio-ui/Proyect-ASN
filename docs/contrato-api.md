# Contrato de API — Proyecto ASN441

Estado: contrato acordado para desarrollo.
La API todavía está en implementación.

Responsable de API: William.
Responsable de base de datos: Gabriel.
Responsable de integración frontend: Helen.

## Direcciones

Local: http://localhost:7071/api
Producción: pendiente del despliegue en Azure.

El frontend utiliza VITE_API_BASE_URL.
Su valor termina en /api, sin barra final.

## Estudiante

| Campo | Tipo | Regla |
|---|---|---|
| id | Entero | Generado por la base de datos |
| nombres | Texto | Obligatorio, de 1 a 100 caracteres |
| apellidos | Texto | Obligatorio, de 1 a 100 caracteres |
| carnet | Texto | Obligatorio, único, de 1 a 30 caracteres |
| edad | Entero | Entre 0 y 120 |

Los límites son decisiones del proyecto, no reglas institucionales.

Antes de validar, se eliminan espacios al inicio y al final
de nombres, apellidos y carnet.

El carnet se convierte a mayúsculas antes de guardarlo.
Se conserva como texto para mantener ceros iniciales.
La base de datos debe garantizar su unicidad.

El backend realiza las validaciones, aunque el frontend
también las aplique.

## Listar estudiantes

GET /estudiantes

Respuesta: 200 OK.
Orden: id ascendente.

[
  {
    "id": 1,
    "nombres": "Ana",
    "apellidos": "Pérez",
    "carnet": "001234",
    "edad": 20
  }
]

Sin registros, devuelve [].

## Registrar estudiante

POST /estudiantes
Content-Type: application/json

Cuerpo:

{
  "nombres": "Ana",
  "apellidos": "Pérez",
  "carnet": "001234",
  "edad": 20
}

Respuesta: 201 Created.

Devuelve el estudiante guardado con su id.

El cliente no envía id.
Se rechazan campos adicionales y tipos incorrectos.

## Eliminar estudiante

DELETE /estudiantes/{id}

Respuesta: 204 No Content.
No devuelve cuerpo ni JSON.

Si el estudiante no existe, devuelve 404.

## Errores

Formato común:

{
  "error": {
    "codigo": "CARNET_DUPLICADO",
    "mensaje": "Ya existe un estudiante con ese carnet."
  }
}

| Estado | Código | Situación |
|---|---|---|
| 400 | DATOS_INVALIDOS | Campos, tipos o id inválidos |
| 400 | JSON_INVALIDO | Cuerpo JSON mal formado |
| 404 | ESTUDIANTE_NO_ENCONTRADO | Registro inexistente |
| 409 | CARNET_DUPLICADO | Carnet ya registrado |
| 500 | ERROR_INTERNO | Error inesperado |

Los errores internos no deben revelar contraseñas,
consultas SQL ni detalles de infraestructura.

## Integración

- La base de datos está en Azure.
- La API está en Azure Functions.
- El frontend está en Google Cloud Run.
- CORS local debe permitir http://localhost:5173.
- CORS de producción debe permitir el origen del sitio publicado.
- Métodos requeridos: GET, POST, DELETE y OPTIONS.
- Header requerido: Content-Type.
- No se utiliza mode: "no-cors".

## Coordinación

Los cambios al contrato requieren coordinación con
William, Gabriel y Helen.

Helen puede desarrollar con datos ficticios que respeten
este contrato mientras la API esté en construcción.
Las pruebas finales deben usar la API y PostgreSQL reales.