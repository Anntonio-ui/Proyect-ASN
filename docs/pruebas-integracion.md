# Matriz de Pruebas de Integración y Validación

**Responsable:** Sarai (Google Cloud Run y Pruebas Integrales)  
**Estado General:** Pendiente (Esperando inicio de laboratorio / integración con Azure)

---

### Nota sobre Pruebas Locales y Limitación Técnica
Durante la fase de preparación local se ejecutó la verificación de Docker en la terminal mediante `docker --version`, obteniendo una respuesta de no disponibilidad del servicio (`CommandNotFoundException`). Debido a esto, las pruebas de contenedorización local quedan documentadas con esta limitación. La ejecución real de las pruebas integrales se llevará a cabo una vez desplegada la aplicación en Google Cloud Run.

---

## Matriz de Casos de Prueba

| ID | Caso de Prueba | Pasos de Ejecución | Resultado Esperado | Resultado Observado | Evidencia | Estado |
|---|---|---|---|---|---|---|
| TC01 | Listado de estudiantes | Cargar la pantalla principal de la aplicación. | La lista de estudiantes se obtiene y muestra correctamente desde la API en Azure. | Pendiente | - | Pendiente |
| TC02 | Registro de nuevo estudiante | Llenar el formulario de registro y presionar el botón de guardar. | La API responde con estado 201 y el nuevo estudiante aparece en el listado. | Pendiente | - | Pendiente |
| TC03 | Intento de registro duplicado | Registrar un estudiante con un carnet o correo que ya existe. | La aplicación muestra un mensaje claro indicando que el registro ya existe. | Pendiente | - | Pendiente |
| TC04 | Validaciones de formulario | Intentar enviar el formulario dejando campos obligatorios vacíos. | Se muestran alertas en los campos requeridos antes de enviar la solicitud. | Pendiente | - | Pendiente |
| TC05 | Eliminación de registro | Seleccionar la opción de eliminar sobre un estudiante existente. | Se confirma la acción y el registro se elimina de la base de datos PostgreSQL. | Pendiente | - | Pendiente |
| TC06 | Persistencia de datos | Recargar la página del navegador tras realizar cambios. | Los datos guardados previamente se mantienen visibles de forma correcta. | Pendiente | - | Pendiente |
| TC07 | Adaptabilidad en dispositivos móviles | Abrir la interfaz en una pantalla de tamaño móvil o vista adaptativa. | La interfaz se ajusta correctamente sin desbordamientos de texto o botones. | Pendiente | - | Pendiente |
| TC08 | Carga y visualización de fotografías | Subir una foto de perfil en el registro de estudiante. | La imagen se procesa, almacena y visualiza de forma correcta. | Pendiente | - | Pendiente |
| TC09 | Integración Escudo / Seguridad | Intentar acceder a rutas protegidas sin credenciales válidas. | El sistema deniega el acceso o redirige a la pantalla de autenticación. | Pendiente | - | Pendiente |

---

*Nota: Todos los estados se mantendrán marcados como "Pendiente" hasta que el laboratorio sea activado por William y se ejecuten las pruebas sobre la URL pública final de Cloud Run.*
