from django.urls import path, include
from rest_framework.routers import DefaultRouter
from modules.settings_manager.views import SystemSettingViewSet

router = DefaultRouter()
router.register("", SystemSettingViewSet, basename="setting")

urlpatterns = [
    path("", include(router.urls)),
]
