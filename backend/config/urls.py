from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    
    # API endpoints
    path("api/auth/", include("modules.authentication.urls")),
    path("api/users/", include("modules.users.urls")),
    path("api/academics/", include("modules.academics.urls")),
    path("api/organizations/", include("modules.organizations.urls")),
    path("api/opportunities/", include("modules.opportunities.urls")),
    path("api/documents/", include("modules.documents.urls")),
    path("api/dashboard/", include("modules.dashboard.urls")),
    path("api/notifications/", include("modules.notifications.urls")),
    path("api/settings/", include("modules.settings_manager.urls")),
    path("api/search/", include("modules.search.urls")),
    path("api/reports/", include("modules.reports.urls")),
    path("api/audit-logs/", include("modules.common.audit_urls")),
    
    # API Documentation
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/schema/swagger-ui/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/schema/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
]

# Media and Static Files serving during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
