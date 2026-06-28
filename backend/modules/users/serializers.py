from rest_framework import serializers
from modules.users.models import User
from modules.academics.models import Department

class UserSerializer(serializers.ModelSerializer):
    department_name = serializers.ReadOnlyField(source="department.name")
    department_code = serializers.ReadOnlyField(source="department.code")

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "role",
            "phone_number",
            "is_approved",
            "avatar",
            "department",
            "department_name",
            "department_code",
            "is_superuser"
        ]
        read_only_fields = ["id", "is_approved", "is_superuser"]

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password", "role", "phone_number", "department"]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
            role=validated_data.get("role", "STUDENT"),
            phone_number=validated_data.get("phone_number", ""),
            department=validated_data.get("department", None)
        )
        return user
