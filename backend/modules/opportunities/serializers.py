from rest_framework import serializers
from modules.opportunities.models import Opportunity
from modules.academics.serializers import ResearchAreaSerializer

class OpportunitySerializer(serializers.ModelSerializer):
    institution_name = serializers.ReadOnlyField(source="institution.name")
    institution_custom_id = serializers.ReadOnlyField(source="institution.custom_id")
    institution_county = serializers.ReadOnlyField(source="institution.county")
    research_area_name = serializers.ReadOnlyField(source="research_area.name")
    type_display = serializers.CharField(source="get_type_display", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Opportunity
        fields = [
            "id",
            "title",
            "institution",
            "institution_name",
            "institution_custom_id",
            "institution_county",
            "type",
            "type_display",
            "description",
            "requirements",
            "slots",
            "funding_amount",
            "research_area",
            "research_area_name",
            "application_deadline",
            "status",
            "status_display",
            "created_at",
            "updated_at"
        ]

class OpportunityWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Opportunity
        fields = "__all__"
