from rest_framework.views import exception_handler
from rest_framework import status
from rest_framework.response import Response

def custom_exception_handler(exc, context):
    """
    Returns custom standardized JSON error response.
    """
    response = exception_handler(exc, context)

    if response is not None:
        # standardizing django-rest-framework details
        error_msg = "Validation failed"
        if isinstance(response.data, dict):
            if "detail" in response.data:
                error_msg = response.data["detail"]
                del response.data["detail"]
        elif isinstance(response.data, list):
            error_msg = response.data[0]

        response.data = {
            "success": False,
            "error": error_msg,
            "details": response.data
        }
    else:
        # Unhandled exceptions
        # Log the error for debugging
        import logging
        logger = logging.getLogger("django")
        logger.error(f"Unhandled exception: {exc}", exc_info=True)

        return Response(
            {
                "success": False,
                "error": "A server error occurred. Please contact the administrator.",
                "details": str(exc)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return response
