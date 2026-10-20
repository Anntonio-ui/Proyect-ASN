import json
import unittest
from unittest.mock import patch

import azure.functions as func
import psycopg

import function_app as api
from services.db import DatabaseConfigurationError


class EndpointTests(unittest.TestCase):
    def request(self, method, body=None, student_id=None):
        return func.HttpRequest(
            method=method,
            url="http://localhost:7071/api/estudiantes",
            headers={"Content-Type": "application/json"},
            params={},
            route_params=(
                {"id": student_id} if student_id is not None else {}
            ),
            body=(
                json.dumps(body).encode("utf-8")
                if body is not None
                else b""
            ),
        )

    def response_json(self, response):
        return json.loads(response.get_body().decode("utf-8"))

    def student(self):
        return {
            "id": 1,
            "nombres": "Ana",
            "apellidos": "Pérez",
            "carnet": "AB001",
            "edad": 20,
        }

    @patch("function_app.list_students")
    def test_list_returns_students(self, mock_list):
        mock_list.return_value = [self.student()]

        response = api.students(self.request("GET"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            self.response_json(response),
            [self.student()],
        )

    @patch("function_app.list_students", return_value=[])
    def test_empty_list(self, mock_list):
        response = api.students(self.request("GET"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.response_json(response), [])

    @patch("function_app.create_student")
    def test_create_returns_201_and_normalized_data(self, mock_create):
        mock_create.return_value = self.student()
        data = {
            "nombres": " Ana ",
            "apellidos": " Pérez ",
            "carnet": " ab001 ",
            "edad": 20,
        }

        response = api.students(self.request("POST", data))

        self.assertEqual(response.status_code, 201)
        self.assertEqual(self.response_json(response), self.student())
        mock_create.assert_called_once_with({
            "nombres": "Ana",
            "apellidos": "Pérez",
            "carnet": "AB001",
            "edad": 20,
        })

    @patch("function_app.create_student")
    def test_invalid_data_does_not_access_database(self, mock_create):
        response = api.students(self.request("POST", {}))

        self.assertEqual(response.status_code, 400)
        mock_create.assert_not_called()

    @patch("function_app.create_student")
    def test_duplicate_carnet_returns_409(self, mock_create):
        mock_create.side_effect = psycopg.errors.UniqueViolation()
        data = self.student()
        del data["id"]

        response = api.students(self.request("POST", data))

        self.assertEqual(response.status_code, 409)
        self.assertEqual(
            self.response_json(response)["error"]["codigo"],
            "CARNET_DUPLICADO",
        )

    @patch("function_app.delete_student", return_value=True)
    def test_delete_returns_204_without_body(self, mock_delete):
        response = api.remove_student(
            self.request("DELETE", student_id="1")
        )

        self.assertEqual(response.status_code, 204)
        self.assertEqual(response.get_body(), b"")
        mock_delete.assert_called_once_with(1)

    @patch("function_app.delete_student", return_value=False)
    def test_missing_student_returns_404(self, mock_delete):
        response = api.remove_student(
            self.request("DELETE", student_id="1")
        )

        self.assertEqual(response.status_code, 404)
        self.assertEqual(
            self.response_json(response)["error"]["codigo"],
            "ESTUDIANTE_NO_ENCONTRADO",
        )

    @patch("function_app.delete_student")
    def test_invalid_id_does_not_access_database(self, mock_delete):
        response = api.remove_student(
            self.request("DELETE", student_id="abc")
        )

        self.assertEqual(response.status_code, 400)
        mock_delete.assert_not_called()

    @patch("function_app.list_students")
    def test_missing_configuration_returns_safe_error(self, mock_list):
        mock_list.side_effect = DatabaseConfigurationError(
            "Detalle privado de configuración"
        )

        with self.assertLogs(level="ERROR"):
            response = api.students(self.request("GET"))

        self.assertEqual(response.status_code, 500)
        self.assertNotIn(
            "Detalle privado",
            response.get_body().decode("utf-8"),
        )

    @patch("function_app.list_students")
    def test_unexpected_error_does_not_expose_details(self, mock_list):
        mock_list.side_effect = RuntimeError("Detalle privado")

        with self.assertLogs(level="ERROR"):
            response = api.students(self.request("GET"))

        self.assertEqual(response.status_code, 500)
        self.assertEqual(
            self.response_json(response)["error"]["codigo"],
            "ERROR_INTERNO",
        )
        self.assertNotIn(
            "Detalle privado",
            response.get_body().decode("utf-8"),
        )


if __name__ == "__main__":
    unittest.main()