from rest_framework import serializers
from modules.documents.models import Document, MoU
from modules.organizations.serializers import InstitutionSerializer

class DocumentSerializer(serializers.ModelSerializer):
    uploaded_by_username = serializers.ReadOnlyField(source="uploaded_by.username")
    institution_name = serializers.ReadOnlyField(source="institution.name")

    class Meta:
        model = Document
        fields = [
            "id",
            "title",
            "file",
            "institution",
            "institution_name",
            "document_type",
            "is_public",
            "uploaded_at",
            "uploaded_by_username"
        ]
        read_only_fields = ["id", "uploaded_at", "uploaded_by_username"]

class MoUSerializer(serializers.ModelSerializer):
    institution_name = serializers.ReadOnlyField(source="institution.name")
    institution_custom_id = serializers.ReadOnlyField(source="institution.custom_id")
    document_title = serializers.ReadOnlyField(source="document.title")
    document_file = serializers.SerializerMethodField()

    class Meta:
        model = MoU
        fields = [
            "id",
            "institution",
            "institution_name",
            "institution_custom_id",
            "document",
            "document_title",
            "document_file",
            "start_date",
            "end_date",
            "status",
            "signed_by_university",
            "signed_by_institution",
            "description",
            "created_at"
        ]

    def get_document_file(self, obj):
        if obj.document and obj.document.file:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.document.file.url)
            return obj.document.file.url
        return None

class MoUWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoU
        fields = "__all__"
