from psycopg.rows import dict_row

from services.db import get_connection


def list_students():
    with get_connection() as connection:
        with connection.cursor(row_factory=dict_row) as cursor:
            cursor.execute(
                """
                SELECT id, nombres, apellidos, carnet, edad
                FROM estudiantes
                ORDER BY id ASC
                """
            )
            return cursor.fetchall()


def create_student(student):
    with get_connection() as connection:
        with connection.cursor(row_factory=dict_row) as cursor:
            cursor.execute(
                """
                INSERT INTO estudiantes
                    (nombres, apellidos, carnet, edad)
                VALUES (%s, %s, %s, %s)
                RETURNING id, nombres, apellidos, carnet, edad
                """,
                (
                    student["nombres"],
                    student["apellidos"],
                    student["carnet"],
                    student["edad"],
                ),
            )
            return cursor.fetchone()


def delete_student(student_id):
    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                DELETE FROM estudiantes
                WHERE id = %s
                RETURNING id
                """,
                (student_id,),
            )
            return cursor.fetchone() is not None