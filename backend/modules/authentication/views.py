from rest_framework import status, permissions, views
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from modules.authentication.serializers import CustomTokenObtainPairSerializer
from modules.common.responses import success_response, error_response
from modules.common.services import log_action

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == status.HTTP_200_OK:
            # log successful login
            user_data = response.data.get("user")
            # We fetch the user object to pass to the logging service
            from modules.users.models import User
            try:
                user = User.objects.get(id=user_data["id"])
                log_action(user=user, action="LOGIN", module="AUTHENTICATION", details="User logged in successfully.")
            except Exception:
                pass
        return response

class LogoutView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return error_response(message="Refresh token is required.", status_code=status.HTTP_400_BAD_REQUEST)
            
            token = RefreshToken(refresh_token)
            token.blacklist()
            log_action(user=request.user, action="LOGOUT", module="AUTHENTICATION", details="User logged out successfully.")
            return success_response(message="Logout successful.")
        except Exception as e:
            return error_response(message="Token is invalid or expired.", details=str(e), status_code=status.HTTP_400_BAD_REQUEST)
