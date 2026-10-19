import json
import logging

import azure.functions as func
import psycopg

from services.db import DatabaseConfigurationError
from services.students import (
    create_student,
    delete_student,
    list_students,
)
from services.validation import (
    ValidationError,
    validate_student,
    validate_student_id,
)

app = func.FunctionApp(
    http_auth_level=func.AuthLevel.ANONYMOUS
)


def json_response(data, status_code=200):
    return func.HttpResponse(
        body=json.dumps(data, ensure_ascii=False),
        status_code=status_code,
        mimetype="application/json",
        charset="utf-8",
    )


def error_response(code, message, status_code):
    return json_response(
        {
            "error": {
                "codigo": code,
                "mensaje": message,
            }
        },
        status_code,
    )


def internal_error():
    return error_response(
        "ERROR_INTERNO",
        "No se pudo completar la operación.",
        500,
    )


@app.route(route="health", methods=["GET"])
def health(req: func.HttpRequest) -> func.HttpResponse:
    return json_response(
        {
            "status": "ok",
            "service": "Proyect-ASN API",
        }
    )


@app.route(route="estudiantes", methods=["GET", "POST"])
def students(req: func.HttpRequest) -> func.HttpResponse:
    try:
        if req.method == "GET":
            return json_response(list_students())

        try:
            data = req.get_json()
        except ValueError:
            return error_response(
                "JSON_INVALIDO",
                "El cuerpo debe contener JSON válido.",
                400,
            )

        student = validate_student(data)
        created = create_student(student)
        return json_response(created, 201)

    except ValidationError as exc:
        return error_response(
            "DATOS_INVALIDOS",
            str(exc),
            400,
        )

    except psycopg.errors.UniqueViolation:
        return error_response(
            "CARNET_DUPLICADO",
            "Ya existe un estudiante con ese carnet.",
            409,
        )

    except DatabaseConfigurationError:
        logging.error("Configuración de PostgreSQL incompleta.")
        return internal_error()

    except Exception:
        logging.exception("Error al consultar o registrar estudiantes.")
        return internal_error()


@app.route(route="estudiantes/{id}", methods=["DELETE"])
def remove_student(req: func.HttpRequest) -> func.HttpResponse:
    try:
        student_id = validate_student_id(
            req.route_params.get("id")
        )

        if not delete_student(student_id):
            return error_response(
                "ESTUDIANTE_NO_ENCONTRADO",
                "El estudiante no existe.",
                404,
            )

        return func.HttpResponse(status_code=204)

    except ValidationError as exc:
        return error_response(
            "DATOS_INVALIDOS",
            str(exc),
            400,
        )

    except DatabaseConfigurationError:
        logging.error("Configuración de PostgreSQL incompleta.")
        return internal_error()

    except Exception:
        logging.exception("Error al eliminar estudiante.")
        return internal_error()