from rest_framework import views, permissions, status
from rest_framework.response import Response
from modules.reports.services import generate_csv_report, generate_excel_report, generate_pdf_report
from modules.organizations.models import Institution
from modules.academics.models import Department, Course
from modules.opportunities.models import Opportunity
from modules.documents.models import MoU
from modules.common.responses import error_response

class ReportExportView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """
        Triggers report downloads.
        Query Params:
        - type: partners | courses | departments | mous | opportunities | strategic | emerging
        - format: csv | excel | pdf
        """
        report_type = request.query_params.get("type", "partners")
        export_format = request.query_params.get("format", "excel").lower()

        if export_format not in ["csv", "excel", "pdf"]:
            return error_response(message="Invalid format. Supported formats: csv, excel, pdf.", status_code=status.HTTP_400_BAD_REQUEST)

        # 1. Partners / Institutions Report
        if report_type in ["partners", "strategic", "emerging"]:
            queryset = Institution.objects.all().select_related("category")
            if report_type == "strategic":
                queryset = queryset.filter(status="STRATEGIC")
                title = "Strategic Partners"
            elif report_type == "emerging":
                queryset = queryset.filter(status="EMERGING")
                title = "Emerging Partners"
            else:
                title = "All Partners"

            headers = [
                "ID", "Name", "Category", "County", "Contact Email", 
                "Contact Phone", "Contact Person", "Status", "Remarks", 
                "Internship", "Attachment", "Research", "Funding"
            ]
            rows = []
            for inst in queryset:
                rows.append([
                    inst.custom_id,
                    inst.name,
                    inst.category.name if inst.category else "",
                    inst.county,
                    inst.contact_email or "",
                    inst.contact_phone or "",
                    inst.contact_person_name or "",
                    inst.get_status_display(),
                    inst.remarks or "",
                    "Yes" if inst.has_internship else "No",
                    "Yes" if inst.has_attachment else "No",
                    "Yes" if inst.has_joint_research else "No",
                    "Yes" if inst.has_funding else "No",
                ])

        # 2. Courses Report
        elif report_type == "courses":
            title = "Academic Courses"
            queryset = Course.objects.all().select_related("department")
            headers = ["Code", "Name", "Department", "Level"]
            rows = []
            for c in queryset:
                rows.append([
                    c.code,
                    c.name,
                    c.department.name if c.department else "",
                    c.get_level_display()
                ])

        # 3. Departments Report
        elif report_type == "departments":
            title = "Academic Departments"
            queryset = Department.objects.all()
            headers = ["Code", "Name", "Description"]
            rows = []
            for d in queryset:
                rows.append([
                    d.code,
                    d.name,
                    d.description or ""
                ])

        # 4. MoUs Report
        elif report_type == "mous":
            title = "Memoranda of Understanding"
            queryset = MoU.objects.all().select_related("institution")
            headers = ["Institution ID", "Institution Name", "Start Date", "End Date", "Status", "University Signee", "Partner Signee"]
            rows = []
            for m in queryset:
                rows.append([
                    m.institution.custom_id,
                    m.institution.name,
                    m.start_date.strftime("%Y-%m-%d") if m.start_date else "",
                    m.end_date.strftime("%Y-%m-%d") if m.end_date else "",
                    m.get_status_display(),
                    m.signed_by_university,
                    m.signed_by_institution
                ])

        # 5. Opportunities Report
        elif report_type == "opportunities":
            title = "Partnership Opportunities"
            queryset = Opportunity.objects.all().select_related("institution", "research_area")
            headers = ["Title", "Institution Name", "Type", "Slots", "Funding Amount", "Research Area", "Deadline", "Status"]
            rows = []
            for o in queryset:
                rows.append([
                    o.title,
                    o.institution.name,
                    o.get_type_display(),
                    o.slots,
                    o.funding_amount if o.funding_amount else 0,
                    o.research_area.name if o.research_area else "N/A",
                    o.application_deadline.strftime("%Y-%m-%d") if o.application_deadline else "Open",
                    o.get_status_display()
                ])

        else:
            return error_response(message="Invalid report type specified.", status_code=status.HTTP_400_BAD_REQUEST)

        # Trigger downloads based on requested format
        if export_format == "csv":
            return generate_csv_report(title, headers, rows)
        elif export_format == "excel":
            return generate_excel_report(title, headers, rows)
        elif export_format == "pdf":
            return generate_pdf_report(title, headers, rows)

        return error_response(message="An error occurred building the report.")
