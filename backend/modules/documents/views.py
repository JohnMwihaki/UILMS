from rest_framework import viewsets, filters, permissions
from django_filters.rest_framework import DjangoFilterBackend
from modules.documents.models import Document, MoU
from modules.documents.serializers import DocumentSerializer, MoUSerializer, MoUWriteSerializer
from modules.common.permissions import IsAdminOrReadOnly
from modules.common.services import log_action

class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["document_type", "is_public", "institution"]
    search_fields = ["title"]

    def get_permissions(self):
        # Anyone can list public documents, but only admin can manage (create, delete, update)
        if self.action in ["list", "retrieve"]:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsAdminOrReadOnly()]

    def get_queryset(self):
        user = self.request.user
        # Public users can only see public documents
        if not user or not user.is_authenticated:
            return Document.objects.filter(is_public=True).order_by("-uploaded_at")
        # Admins can see all documents
        if user.role == "ADMIN":
            return Document.objects.all().order_by("-uploaded_at")
        # Others can see public documents, or private ones related to their department
        return Document.objects.filter(is_public=True).order_by("-uploaded_at")

    def perform_create(self, serializer):
        doc = serializer.save(uploaded_by=self.request.user)
        log_action(
            user=self.request.user,
            action="UPLOAD_DOCUMENT",
            module="DOCUMENT",
            details=f"Uploaded document: {doc.title} ({doc.get_document_type_display()})"
        )

    def perform_destroy(self, instance):
        log_action(
            user=self.request.user,
            action="DELETE_DOCUMENT",
            module="DOCUMENT",
            details=f"Deleted document: {instance.title}"
        )
        # Delete underlying file
        instance.file.delete(save=False)
        instance.delete()

class MoUViewSet(viewsets.ModelViewSet):
    queryset = MoU.objects.all().select_related("institution", "document").order_by("-created_at")
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["status", "institution"]
    search_fields = ["signed_by_university", "signed_by_institution", "description"]

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return MoUWriteSerializer
        return MoUSerializer

    def perform_create(self, serializer):
        mou = serializer.save()
        log_action(
            user=self.request.user,
            action="CREATE",
            module="MOU",
            details=f"Created MoU with {mou.institution.name} starting {mou.start_date} to {mou.end_date}"
        )

    def perform_update(self, serializer):
        mou = serializer.save()
        log_action(
            user=self.request.user,
            action="UPDATE",
            module="MOU",
            details=f"Updated MoU with {mou.institution.name} status to {mou.status}"
        )

    def perform_destroy(self, instance):
        log_action(
            user=self.request.user,
            action="DELETE",
            module="MOU",
            details=f"Deleted MoU with {instance.institution.name} ({instance.start_date} to {instance.end_date})"
        )
        instance.delete()
