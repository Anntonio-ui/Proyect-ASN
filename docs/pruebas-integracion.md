# Matriz de aceptación — ASN441

Completar observado, evidencia y fecha solo después de ejecutar cada caso.
Los tests simulados no prueban Azure, PostgreSQL, CORS ni Google Cloud.

| ID | Caso | Resultado esperado | Observado / evidencia |
|---|---|---|---|
| 01 | Abrir la URL final en ventana privada | Página y recursos cargan, sin errores JS | Pendiente |
| 02 | Listado real | Coincide con PostgreSQL | Pendiente |
| 03 | Registro válido con carnet ficticio único | 201 y registro visible | Pendiente |
| 04 | Recargar después de crear | Registro persiste | Pendiente |
| 05 | Repetir carnet, también en minúsculas | 409 y error junto a carnet | Pendiente |
| 06 | Campos vacíos y edad inválida | Error claro y sin registro | Pendiente |
| 07 | Búsqueda por nombre, apellido y carnet | Coincidencias correctas, conserva ceros | Pendiente |
| 08 | Búsqueda sin coincidencias | Estado específico y limpiar búsqueda | Pendiente |
| 09 | Cancelar eliminación | No envía DELETE ni modifica registro | Pendiente |
| 10 | Confirmar eliminación de dato ficticio | 204, registro desaparece | Pendiente |
| 11 | Recargar después de eliminar | Eliminación persiste | Pendiente |
| 12 | Fallo de red y reintento | Mensaje, sin cifras inventadas; se recupera | Pendiente |
| 13 | Registros por edad y promedio | Cálculos corresponden al listado completo | Pendiente |
| 14 | Móvil y teclado | Sin desbordamiento general; foco y Escape funcionan | Pendiente |
| 15 | Fotografías del equipo | Cinco fotos reales; no iniciales pendientes | Pendiente |
| 16 | Escudo del Barcelona | Visible y sin enlace roto | Pendiente |
| 17 | Preflight desde Cloud Run | Origen exacto autorizado en Azure | Pendiente |
| 18 | Contenedor y recarga | PORT dinámico, /healthz 200 y SPA funciona | Pendiente |

Usar solo estudiantes ficticios de prueba y eliminar únicamente los creados para
la prueba. No existe correo ni subida de fotos de estudiantes ni login en el alcance.
La API es anónima; una demostración pública debe usar datos ficticios.

Estado real del desarrollo y comprobaciones locales: ver VALIDACION.md.
