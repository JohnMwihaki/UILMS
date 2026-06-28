from django.urls import path
from modules.reports.views import ReportExportView

urlpatterns = [
    path("export/", ReportExportView.as_view(), name="report-export"),
]
