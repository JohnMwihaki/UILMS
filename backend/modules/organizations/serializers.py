from rest_framework import serializers
from modules.organizations.models import InstitutionCategory, Institution
from modules.academics.serializers import DepartmentSerializer, CourseSerializer

class InstitutionCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = InstitutionCategory
        fields = ["id", "name", "description"]

class InstitutionSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source="category.name")
    departments = DepartmentSerializer(many=True, read_only=True)
    courses = CourseSerializer(many=True, read_only=True)

    class Meta:
        model = Institution
        fields = [
            "id",
            "custom_id",
            "name",
            "category",
            "category_name",
            "county",
            "address",
            "website",
            "contact_email",
            "contact_phone",
            "contact_person_name",
            "contact_person_role",
            "description",
            "logo",
            "status",
            "remarks",
            "departments",
            "courses",
            "has_internship",
            "has_attachment",
            "has_joint_research",
            "has_staff_exchange",
            "has_grant_writing",
            "has_lab_training",
            "has_curriculum_dev",
            "has_funding",
            "created_at",
            "updated_at"
        ]

class InstitutionWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institution
        fields = "__all__"
