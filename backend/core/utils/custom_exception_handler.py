from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError, NotAuthenticated, PermissionDenied

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        message = "An error occurred."
        if isinstance(exc, ValidationError):
            message = exc.detail  # DRF already returns detailed validation errors
        elif isinstance(exc, NotAuthenticated):
            message = "Authentication credentials were not provided or invalid."
        elif isinstance(exc, PermissionDenied):
            message = "You do not have permission to perform this action."
        elif response.status_code == 404:
            message = "Data not found."

        # Wrap everything in a uniform JSON structure
        response.data = {
            "success": False,
            "data": message,
        }
    else:
        # If DRF didn't handle it (e.g., a server error), return 500 JSON
        return Response(
            {
                "success": False,
                "data": "Internal server error."
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return response
