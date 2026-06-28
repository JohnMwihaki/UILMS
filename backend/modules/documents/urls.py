from django.urls import path, include
from rest_framework.routers import DefaultRouter
from modules.documents.views import DocumentViewSet, MoUViewSet

router = DefaultRouter()
router.register("files", DocumentViewSet, basename="document-file")
router.register("mous", MoUViewSet, basename="document-mou")

urlpatterns = [
    path("", include(router.urls)),
]
