import os

import psycopg


class DatabaseConfigurationError(Exception):
    """La configuración de PostgreSQL está incompleta."""


def get_connection():
    required_variables = (
        "PGHOST",
        "PGDATABASE",
        "PGUSER",
        "PGPASSWORD",
    )

    missing = [
        name
        for name in required_variables
        if not os.environ.get(name, "").strip()
    ]

    if missing:
        raise DatabaseConfigurationError(
            "Faltan variables de conexión: " + ", ".join(missing)
        )

    return psycopg.connect(
        host=os.environ["PGHOST"],
        port=os.environ.get("PGPORT", "5432"),
        dbname=os.environ["PGDATABASE"],
        user=os.environ["PGUSER"],
        password=os.environ["PGPASSWORD"],
        sslmode=os.environ.get("PGSSLMODE", "require"),
        connect_timeout=10,
    )