from django.urls import path, include
from rest_framework.routers import DefaultRouter
from modules.users.views import UserViewSet, ProfileView

router = DefaultRouter()
router.register("", UserViewSet, basename="user")

urlpatterns = [
    path("profile/", ProfileView.as_view(), name="user-profile"),
    path("", include(router.urls)),
]
