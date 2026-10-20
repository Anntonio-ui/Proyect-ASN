"""Prueba HTTP REAL y optativa. Crea y elimina únicamente su propio registro ficticio.
No se incluye en unittest discover. Usar --write para autorizar el registro de prueba.
"""
import argparse
import json
import sys
import uuid
import urllib.error
import urllib.request


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base-url', required=True, help='URL terminada en /api')
    parser.add_argument('--write', action='store_true', help='Crear y eliminar un registro ficticio')
    args = parser.parse_args()
    base = args.base_url.rstrip('/')
    if not base.startswith(('https://', 'http://localhost:', 'http://127.0.0.1:')):
        parser.error('Usa HTTPS o una dirección local.')

    def request(method, path, body=None):
        req = urllib.request.Request(
            base + path,
            data=json.dumps(body).encode() if body is not None else None,
            headers={'Content-Type': 'application/json'}, method=method,
        )
        try:
            response = urllib.request.urlopen(req, timeout=30)
        except urllib.error.HTTPError as error:
            response = error
        with response:
            raw = response.read()
            return response.code, json.loads(raw) if raw else None

    status, data = request('GET', '/health')
    assert status == 200 and data.get('status') == 'ok', 'Health no responde correctamente'
    print('OK: health')
    status, data = request('GET', '/estudiantes')
    assert status == 200 and isinstance(data, list), 'Listado real no disponible; verifica PostgreSQL'
    print('OK: listado real')
    if not args.write:
        print('Solo lectura completada. Usa --write para probar persistencia, duplicado y eliminación.')
        return

    created_id = None
    payload = {'nombres': 'Prueba integración', 'apellidos': 'Registro ficticio',
               'carnet': 'TEST' + uuid.uuid4().hex[:20].upper(), 'edad': 25}
    try:
        status, created = request('POST', '/estudiantes', payload)
        assert status == 201 and type(created.get('id')) is int, 'Falló creación'
        created_id = created['id']
        print('OK: creación')
        status, data = request('GET', '/estudiantes')
        assert status == 200 and any(s['id'] == created_id for s in data), 'Registro no persiste'
        print('OK: persistencia')
        status, data = request('POST', '/estudiantes', payload)
        assert status == 409 and data['error']['codigo'] == 'CARNET_DUPLICADO', 'Falló duplicado'
        print('OK: carnet duplicado')
        status, data = request('DELETE', f'/estudiantes/{created_id}')
        assert status == 204 and data is None, 'Falló eliminación'
        status, data = request('GET', '/estudiantes')
        assert status == 200 and all(s['id'] != created_id for s in data), 'Eliminación no persiste'
        print('OK: eliminación persistente')
    finally:
        if created_id is not None:
            # Nunca se eliminan otros ids. Repetir DELETE puede devolver 404 y es aceptable.
            try:
                status, _ = request('DELETE', f'/estudiantes/{created_id}')
                if status not in (204, 404):
                    print(f'ATENCIÓN: revisar limpieza del registro ficticio id={created_id}')
            except Exception:
                print(f'ATENCIÓN: limpieza pendiente del registro ficticio id={created_id}')


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        print(f'FALLO: {type(error).__name__}: {error}')
        sys.exit(1)
