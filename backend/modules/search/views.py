from rest_framework import views, permissions, status
from rest_framework.response import Response
from django.db.models import Q
from modules.organizations.models import Institution
from modules.organizations.serializers import InstitutionSerializer
from modules.common.responses import success_response
import datetime

class AdvancedSearchView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        """
        Unified advanced search endpoint for both Public and Admin portals.
        Query Params:
        - q: General query search (name, custom_id, contact person, remarks)
        - category: category ID (int)
        - county: county name (exact string)
        - department: department ID (int)
        - course: course ID (int)
        - research_area: research area ID (int)
        - funding_available: true/false
        - internship_available: true/false
        - attachment_available: true/false
        - active_mou: true/false
        """
        queryset = Institution.objects.all().select_related("category").prefetch_related("departments", "courses")

        # General search query
        q = request.query_params.get("q")
        if q:
            queryset = queryset.filter(
                Q(name__icontains=q) |
                Q(custom_id__icontains=q) |
                Q(contact_person_name__icontains=q) |
                Q(remarks__icontains=q) |
                Q(description__icontains=q)
            )

        # Category filter
        category_id = request.query_params.get("category")
        if category_id:
            queryset = queryset.filter(category_id=category_id)

        # County filter
        county = request.query_params.get("county")
        if county:
            queryset = queryset.filter(county__iexact=county)

        # Department filter
        dept_id = request.query_params.get("department")
        if dept_id:
            queryset = queryset.filter(departments__id=dept_id)

        # Course filter
        course_id = request.query_params.get("course")
        if course_id:
            queryset = queryset.filter(courses__id=course_id)

        # Research Area filter (via opportunities)
        research_area_id = request.query_params.get("research_area")
        if research_area_id:
            queryset = queryset.filter(opportunities__research_area_id=research_area_id)

        # Availability flags
        funding = request.query_params.get("funding_available")
        if funding:
            val = funding.lower() == "true"
            queryset = queryset.filter(has_funding=val)

        internship = request.query_params.get("internship_available")
        if internship:
            val = internship.lower() == "true"
            queryset = queryset.filter(has_internship=val)

        attachment = request.query_params.get("attachment_available")
        if attachment:
            val = attachment.lower() == "true"
            queryset = queryset.filter(has_attachment=val)

        # Active MoU filter
        active_mou = request.query_params.get("active_mou")
        if active_mou:
            val = active_mou.lower() == "true"
            today = datetime.date.today()
            if val:
                queryset = queryset.filter(
                    mous__status="ACTIVE",
                    mous__start_date__lte=today,
                    mous__end_date__gte=today
                )
            else:
                queryset = queryset.exclude(
                    mous__status="ACTIVE",
                    mous__start_date__lte=today,
                    mous__end_date__gte=today
                )

        # Remove duplicates from ManyToMany joins
        queryset = queryset.distinct()

        serializer = InstitutionSerializer(queryset, many=True, context={"request": request})
        return success_response(data=serializer.data)
