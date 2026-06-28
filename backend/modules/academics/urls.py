from django.urls import path, include
from rest_framework.routers import DefaultRouter
from modules.academics.views import DepartmentViewSet, CourseViewSet, ResearchAreaViewSet

router = DefaultRouter()
router.register("departments", DepartmentViewSet, basename="department")
router.register("courses", CourseViewSet, basename="course")
router.register("research-areas", ResearchAreaViewSet, basename="research-area")

urlpatterns = [
    path("", include(router.urls)),
]
