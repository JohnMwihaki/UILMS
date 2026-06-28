from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from modules.academics.models import Department, Course, ResearchArea
from modules.academics.serializers import DepartmentSerializer, CourseSerializer, ResearchAreaSerializer
from modules.common.permissions import IsAdminOrReadOnly

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all().order_by("name")
    serializer_class = DepartmentSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "code"]

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all().select_related("department").order_by("name")
    serializer_class = CourseSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["department", "level"]
    search_fields = ["name", "code"]

class ResearchAreaViewSet(viewsets.ModelViewSet):
    queryset = ResearchArea.objects.all().order_by("name")
    serializer_class = ResearchAreaSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]
