/** Estudiante tal como lo devuelve la API (docs/contrato-api.md). */
export interface Student {
  id: number
  nombres: string
  apellidos: string
  /** Texto: conserva los ceros iniciales (ej. "001234"). */
  carnet: string
  edad: number
}

/** Datos que se envían al registrar (POST /estudiantes). El cliente no envía id. */
export interface NewStudent {
  nombres: string
  apellidos: string
  carnet: string
  edad: number
}

/** Valores del formulario tal como se escriben: todo es texto, incluida la edad. */
export interface StudentFormValues {
  nombres: string
  apellidos: string
  carnet: string
  edad: string
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
  | 'SOLICITUD_EN_CURSO'

/** Estado de la carga del listado. */
export type ListStatus = 'cargando' | 'listo' | 'error'