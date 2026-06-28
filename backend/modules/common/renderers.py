from rest_framework.renderers import JSONRenderer

class StandardizedJSONRenderer(JSONRenderer):
    """
    Custom DRF renderer that standardizes all successful JSON responses into the
    {"success": True, "message": None, "data": ...} format expected by the frontend.
    """
    def render(self, data, accepted_media_type=None, renderer_context=None):
        response = renderer_context.get("response") if renderer_context else None
        
        # Check if response is already structured by our manual success_response/error_response
        if isinstance(data, dict) and ("success" in data or "error" in data):
            return super().render(data, accepted_media_type, renderer_context)
            
        formatted_data = {
            "success": True,
            "message": None,
            "data": data
        }
        
        # If response was unsuccessful (status code >= 400), format as error response
        if response and response.status_code >= 400:
            error_msg = "An error occurred"
            if isinstance(data, dict):
                if "detail" in data:
                    error_msg = data["detail"]
                elif len(data) > 0:
                    # Capture first validation error message if dictionary
                    first_key = list(data.keys())[0]
                    first_val = data[first_key]
                    if isinstance(first_val, list) and len(first_val) > 0:
                        error_msg = f"{first_key}: {first_val[0]}"
                    else:
                        error_msg = f"{first_key}: {first_val}"
            
            formatted_data = {
                "success": False,
                "error": error_msg,
                "details": data
            }
            
        return super().render(formatted_data, accepted_media_type, renderer_context)
