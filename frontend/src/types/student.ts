
/** Estudiante tal como lo devuelve la API (docs/contrato-api.md). */
export interface Student {
  id: number
  nombres: string
  apellidos: string
  /** Texto: conserva los ceros iniciales (ej. "001234"). */
  carnet: string
  edad: number
}
 
/** Códigos de error del contrato más los que genera el propio frontend. */
export type ApiErrorCode =
  | 'DATOS_INVALIDOS'
  | 'JSON_INVALIDO'
  | 'ESTUDIANTE_NO_ENCONTRADO'
  | 'CARNET_DUPLICADO'
  | 'ERROR_INTERNO'
  | 'ERROR_RED'
  | 'RESPUESTA_INVALIDA'
  | 'CONFIGURACION'
 
/** Estado de la carga del listado. */
export type ListStatus = 'cargando' | 'listo' | 'error'