from django.urls import path, include
from rest_framework.routers import DefaultRouter
from modules.common.audit_views import AuditLogViewSet

router = DefaultRouter()
router.register("", AuditLogViewSet, basename="audit-log")

urlpatterns = [
    path("", include(router.urls)),
]
