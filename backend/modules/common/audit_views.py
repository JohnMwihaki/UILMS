from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from modules.common.models import AuditLog
from modules.common.audit_serializers import AuditLogSerializer

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only audit log viewer. Only accessible by admin users.
    """
    queryset = AuditLog.objects.select_related("user").order_by("-timestamp")
    serializer_class = AuditLogSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["action", "module", "user"]
    search_fields = ["details", "user__username"]

    def get_permissions(self):
        user = self.request.user
        if not user or not user.is_authenticated or user.role != "ADMIN":
            self.permission_denied(self.request, message="Only administrators can view audit logs.")
        return [permissions.IsAuthenticated()]
