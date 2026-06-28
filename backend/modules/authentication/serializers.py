from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token["username"] = user.username
        token["email"] = user.email
        token["role"] = user.role
        token["is_approved"] = user.is_approved
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Check approval status
        if not self.user.is_approved:
            raise AuthenticationFailed(
                "Your account is pending administrator approval.",
                code="account_pending_approval"
            )

        # Include additional user info in JSON response
        data["user"] = {
            "id": str(self.user.id),
            "username": self.user.username,
            "email": self.user.email,
            "role": self.user.role,
            "phone_number": self.user.phone_number,
            "avatar": self.user.avatar.url if self.user.avatar else None,
            "department": self.user.department.id if self.user.department else None,
            "department_code": self.user.department.code if self.user.department else None,
            "is_superuser": self.user.is_superuser
        }
        return data
