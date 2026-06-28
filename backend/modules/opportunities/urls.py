from django.urls import path, include
from rest_framework.routers import DefaultRouter
from modules.opportunities.views import OpportunityViewSet

router = DefaultRouter()
router.register("", OpportunityViewSet, basename="opportunity")

urlpatterns = [
    path("", include(router.urls)),
]
