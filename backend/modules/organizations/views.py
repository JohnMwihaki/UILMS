from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count
from django_filters.rest_framework import DjangoFilterBackend

from modules.organizations.models import InstitutionCategory, Institution
from modules.organizations.serializers import (
    InstitutionCategorySerializer,
    InstitutionSerializer,
    InstitutionWriteSerializer,
)
from modules.common.permissions import IsAdminOrReadOnly
from modules.common.services import log_action
from modules.common.responses import success_response

class InstitutionCategoryViewSet(viewsets.ModelViewSet):
    queryset = InstitutionCategory.objects.all().order_by("name")
    serializer_class = InstitutionCategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]

class InstitutionViewSet(viewsets.ModelViewSet):
    queryset = Institution.objects.all().select_related("category").prefetch_related("departments", "courses").order_by("-created_at")
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = [
        "category",
        "county",
        "status",
        "has_internship",
        "has_attachment",
        "has_joint_research",
        "has_staff_exchange",
        "has_grant_writing",
        "has_lab_training",
        "has_curriculum_dev",
        "has_funding",
    ]
    search_fields = ["name", "custom_id", "contact_person_name", "remarks"]

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return InstitutionWriteSerializer
        return InstitutionSerializer

    def perform_create(self, serializer):
        institution = serializer.save()
        log_action(
            user=self.request.user,
            action="CREATE",
            module="INSTITUTION",
            details=f"Created institution: {institution.name} ({institution.custom_id})"
        )

    def perform_update(self, serializer):
        institution = serializer.save()
        log_action(
            user=self.request.user,
            action="UPDATE",
            module="INSTITUTION",
            details=f"Updated institution: {institution.name} ({institution.custom_id})"
        )

    def perform_destroy(self, instance):
        log_action(
            user=self.request.user,
            action="DELETE",
            module="INSTITUTION",
            details=f"Deleted institution: {instance.name} ({instance.custom_id})"
        )
        instance.delete()

    @action(detail=False, methods=["get"])
    def statistics(self, request):
        """
        Returns stats: total partners, distribution by category, distribution by status.
        """
        total_partners = Institution.objects.count()
        
        # Category distribution
        by_category = (
            Institution.objects.values("category__name")
            .annotate(count=Count("id"))
            .order_by("-count")
        )
        category_stats = {item["category__name"]: item["count"] for item in by_category}

        # Status distribution
        by_status = (
            Institution.objects.values("status")
            .annotate(count=Count("id"))
            .order_by("-count")
        )
        status_stats = {item["status"]: item["count"] for item in by_status}

        # Collaboration flags counts
        collabs = {
            "internship": Institution.objects.filter(has_internship=True).count(),
            "attachment": Institution.objects.filter(has_attachment=True).count(),
            "joint_research": Institution.objects.filter(has_joint_research=True).count(),
            "staff_exchange": Institution.objects.filter(has_staff_exchange=True).count(),
            "grant_writing": Institution.objects.filter(has_grant_writing=True).count(),
            "lab_training": Institution.objects.filter(has_lab_training=True).count(),
            "curriculum_dev": Institution.objects.filter(has_curriculum_dev=True).count(),
            "funding": Institution.objects.filter(has_funding=True).count(),
        }

        data = {
            "total_partners": total_partners,
            "category_distribution": category_stats,
            "status_distribution": status_stats,
            "collaboration_areas": collabs
        }
        return success_response(data=data)

    @action(detail=False, methods=["get"])
    def counties(self, request):
        """
        Returns county distribution.
        """
        by_county = (
            Institution.objects.values("county")
            .annotate(count=Count("id"))
            .order_by("-count")
        )
        data = [{ "county": item["county"], "count": item["count"] } for item in by_county]
        return success_response(data=data)
