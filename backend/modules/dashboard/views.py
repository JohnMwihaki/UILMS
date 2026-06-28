from rest_framework import views, permissions, status
from django.db.models import Count, Sum
from modules.organizations.models import Institution
from modules.documents.models import MoU
from modules.opportunities.models import Opportunity, OpportunityType
from modules.common.models import AuditLog
from modules.common.responses import success_response
from modules.common.services import log_action

class DashboardStatsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """
        Gathers dashboard metrics for administrators:
        - counts of institutions, active MoUs, specific opportunities
        - recent activities list (audit logs)
        - list of recent activities for charts
        """
        total_partners = Institution.objects.count()
        active_mous = MoU.objects.filter(status="ACTIVE").count()

        # Opportunity type aggregations
        internships = Opportunity.objects.filter(type=OpportunityType.INTERNSHIP, status="OPEN").count()
        attachments = Opportunity.objects.filter(type=OpportunityType.ATTACHMENT, status="OPEN").count()
        research = Opportunity.objects.filter(type=OpportunityType.RESEARCH, status="OPEN").count()
        funding = Opportunity.objects.filter(type=OpportunityType.FUNDING, status="OPEN").count()

        # Total funding amount available
        funding_sum = Opportunity.objects.filter(type=OpportunityType.FUNDING, status="OPEN").aggregate(total=Sum("funding_amount"))["total"] or 0

        # Distribution by Category
        by_category = (
            Institution.objects.values("category__name")
            .annotate(value=Count("id"))
            .order_by("-value")
        )
        category_distribution = [
            { "name": item["category__name"] or "Uncategorized", "value": item["value"] } 
            for item in by_category
        ]

        # Distribution by Status
        by_status = (
            Institution.objects.values("status")
            .annotate(value=Count("id"))
            .order_by("-value")
        )
        status_distribution = [
            { "name": item["status"], "value": item["value"] } 
            for item in by_status
        ]

        # Distribution by County (top 5)
        by_county = (
            Institution.objects.values("county")
            .annotate(value=Count("id"))
            .order_by("-value")[:5]
        )
        county_distribution = [
            { "name": item["county"], "value": item["value"] } 
            for item in by_county
        ]

        # Recent activities (last 10 audit logs)
        recent_logs = AuditLog.objects.select_related("user").order_by("-timestamp")[:10]
        recent_activities = [
            {
                "id": log.id,
                "user": log.user.username if log.user else "System",
                "action": log.action,
                "module": log.module,
                "details": log.details,
                "timestamp": log.timestamp.isoformat()
            }
            for log in recent_logs
        ]

        data = {
            "summary": {
                "total_partners": total_partners,
                "active_mous": active_mous,
                "internships": internships,
                "attachments": attachments,
                "research_collaborations": research,
                "funding_opportunities": funding,
                "total_funding_amount": funding_sum
            },
            "charts": {
                "category_distribution": category_distribution,
                "status_distribution": status_distribution,
                "county_distribution": county_distribution
            },
            "recent_activities": recent_activities
        }

        return success_response(data=data)
