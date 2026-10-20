class ValidationError(ValueError):
    """Los datos recibidos no cumplen el contrato."""


def validate_student(data):
    if not isinstance(data, dict):
        raise ValidationError("El cuerpo debe ser un objeto JSON.")

    required = {"nombres", "apellidos", "carnet", "edad"}

    if set(data) != required:
        raise ValidationError(
            "Envía únicamente nombres, apellidos, carnet y edad."
        )

    student = {}

    for field, maximum in (
        ("nombres", 100),
        ("apellidos", 100),
        ("carnet", 30),
    ):
        value = data[field]

        if not isinstance(value, str):
            raise ValidationError(f"{field} debe ser texto.")

        value = value.strip()

        if field == "carnet":
            value = value.upper()

        if not 1 <= len(value) <= maximum:
            raise ValidationError(
                f"{field} debe tener entre 1 y {maximum} caracteres."
            )

        student[field] = value

    age = data["edad"]

    # bool también es una subclase de int en Python.
    if type(age) is not int or not 0 <= age <= 120:
        raise ValidationError(
            "edad debe ser un número entero entre 0 y 120."
        )

    student["edad"] = age
    return student


def validate_student_id(value):
    if not isinstance(value, str):
        raise ValidationError("El id debe ser un entero positivo.")

    if not value.isascii() or not value.isdecimal():
        raise ValidationError("El id debe ser un entero positivo.")

    if len(value) > 10:
        raise ValidationError("El id está fuera del rango permitido.")

    student_id = int(value)

    if not 1 <= student_id <= 2_147_483_647:
        raise ValidationError("El id está fuera del rango permitido.")

    return student_id