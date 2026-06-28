from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from modules.opportunities.models import Opportunity
from modules.opportunities.serializers import OpportunitySerializer, OpportunityWriteSerializer
from modules.common.permissions import IsAdminOrReadOnly
from modules.common.services import log_action

class OpportunityViewSet(viewsets.ModelViewSet):
    queryset = Opportunity.objects.all().select_related("institution", "research_area").order_by("-created_at")
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["type", "status", "institution", "research_area"]
    search_fields = ["title", "description", "requirements"]

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return OpportunityWriteSerializer
        return OpportunitySerializer

    def perform_create(self, serializer):
        opp = serializer.save()
        log_action(
            user=self.request.user,
            action="CREATE",
            module="OPPORTUNITY",
            details=f"Created opportunity: {opp.title} ({opp.get_type_display()}) at {opp.institution.name}"
        )

    def perform_update(self, serializer):
        opp = serializer.save()
        log_action(
            user=self.request.user,
            action="UPDATE",
            module="OPPORTUNITY",
            details=f"Updated opportunity: {opp.title} ({opp.get_type_display()}) at {opp.institution.name}"
        )

    def perform_destroy(self, instance):
        log_action(
            user=self.request.user,
            action="DELETE",
            module="OPPORTUNITY",
            details=f"Deleted opportunity: {instance.title} ({instance.get_type_display()}) at {instance.institution.name}"
        )
        instance.delete()
