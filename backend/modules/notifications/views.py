from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from modules.notifications.models import Notification
from modules.notifications.serializers import NotificationSerializer
from modules.common.responses import success_response

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return user's notifications and global ones
        return Notification.objects.filter(
            Q(user=self.request.user) | Q(user__isnull=True)
        ).order_by("-created_at")

    @action(detail=True, methods=["post"])
    def read(self, request, pk=None):
        notif = self.get_object()
        notif.is_read = True
        notif.save()
        return success_response(data=NotificationSerializer(notif).data, message="Notification marked as read.")

    @action(detail=False, methods=["post"])
    def mark_all_read(self, request):
        queryset = self.get_queryset().filter(is_read=False)
        count = queryset.update(is_read=True)
        return success_response(message=f"Marked {count} notifications as read.")
