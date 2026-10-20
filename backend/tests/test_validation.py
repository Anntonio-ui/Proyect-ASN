import unittest

from services.validation import (
    ValidationError,
    validate_student,
    validate_student_id,
)


class StudentValidationTests(unittest.TestCase):
    def valid_data(self):
        return {
            "nombres": " Ana ",
            "apellidos": " Pérez ",
            "carnet": " ab001 ",
            "edad": 20,
        }

    def test_normalizes_text_and_preserves_carnet_zeros(self):
        result = validate_student(self.valid_data())

        self.assertEqual(result["nombres"], "Ana")
        self.assertEqual(result["apellidos"], "Pérez")
        self.assertEqual(result["carnet"], "AB001")

    def test_rejects_missing_and_extra_fields(self):
        missing = self.valid_data()
        del missing["edad"]

        extra = self.valid_data()
        extra["id"] = 1

        for data in (missing, extra):
            with self.subTest(data=data):
                with self.assertRaises(ValidationError):
                    validate_student(data)

    def test_rejects_invalid_age(self):
        for age in (True, "20", 20.5, -1, 121, None):
            with self.subTest(age=age):
                data = self.valid_data()
                data["edad"] = age

                with self.assertRaises(ValidationError):
                    validate_student(data)

    def test_rejects_empty_long_and_non_text_fields(self):
        for field, maximum in (
            ("nombres", 100),
            ("apellidos", 100),
            ("carnet", 30),
        ):
            for value in ("   ", "x" * (maximum + 1), 123):
                with self.subTest(field=field, value=value):
                    data = self.valid_data()
                    data[field] = value

                    with self.assertRaises(ValidationError):
                        validate_student(data)

    def test_rejects_non_object_body(self):
        for data in ([], None, "texto", 123):
            with self.subTest(data=data):
                with self.assertRaises(ValidationError):
                    validate_student(data)

    def test_valid_id(self):
        self.assertEqual(validate_student_id("12"), 12)

    def test_rejects_invalid_id(self):
        for value in ("0", "-1", "abc", "1.5", "2147483648", "9" * 5000):
            with self.subTest(value=value):
                with self.assertRaises(ValidationError):
                    validate_student_id(value)


if __name__ == "__main__":
    unittest.main()