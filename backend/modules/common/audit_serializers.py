from rest_framework import serializers
from modules.common.models import AuditLog

class AuditLogSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source="user.username")

    class Meta:
        model = AuditLog
        fields = ["id", "user", "username", "action", "module", "details", "ip_address", "timestamp"]
        read_only_fields = ["id", "timestamp"]
