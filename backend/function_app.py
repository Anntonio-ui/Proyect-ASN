import json

import azure.functions as func

app = func.FunctionApp(
    http_auth_level=func.AuthLevel.ANONYMOUS
)


@app.route(route="health", methods=["GET"])
def health(req: func.HttpRequest) -> func.HttpResponse:
    return func.HttpResponse(
        body=json.dumps({
            "status": "ok",
            "service": "Proyect-ASN API"
        }),
        status_code=200,
        mimetype="application/json"
    )