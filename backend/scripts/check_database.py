"""Comprobación de solo lectura. Ejecutar desde backend con su entorno virtual."""
import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
settings = ROOT / 'local.settings.json'
if settings.exists():
    for key, value in json.loads(settings.read_text(encoding='utf-8-sig')).get('Values', {}).items():
        if key.startswith('PG'):
            os.environ.setdefault(key, str(value))

from services.db import get_connection  # noqa: E402

try:
    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute('SELECT id, nombres, apellidos, carnet, edad FROM estudiantes LIMIT 0')
            cursor.execute('SELECT COUNT(*) FROM estudiantes')
            print(f'Conexión y columnas correctas. Registros: {cursor.fetchone()[0]}')
except Exception as error:
    print(f'No se pudo verificar PostgreSQL ({type(error).__name__}).')
    print('Revisa configuración PG*, permisos, red y esquema con Gabriel. No compartas contraseñas.')
    sys.exit(1)
