from django.db import models
from django.conf import settings

class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class AuditLog(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="audit_logs"
    )
    action = models.CharField(max_length=50, help_text="e.g. CREATE, UPDATE, DELETE, LOGIN, LOGOUT")
    module = models.CharField(max_length=100, help_text="e.g. INSTITUTION, MOU, OPPORTUNITY, USER")
    details = models.TextField()
    ip_address = models.CharField(max_length=45, blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]

    def __str__(self):
        username = self.user.username if self.user else "System/Anonymous"
        return f"{username} - {self.action} on {self.module} ({self.timestamp})"
