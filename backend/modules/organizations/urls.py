from django.urls import path, include
from rest_framework.routers import DefaultRouter
from modules.organizations.views import InstitutionCategoryViewSet, InstitutionViewSet

router = DefaultRouter()
router.register("categories", InstitutionCategoryViewSet, basename="category")
router.register("institutions", InstitutionViewSet, basename="institution")

urlpatterns = [
    path("", include(router.urls)),
]
