from django.contrib import admin
from .models import Document, MoU

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ("title", "document_type", "institution", "is_public", "uploaded_at", "uploaded_by")
    list_filter = ("document_type", "is_public", "uploaded_at")
    search_fields = ("title", "institution__name")
    raw_id_fields = ("institution", "uploaded_by")
    ordering = ("-uploaded_at",)

@admin.register(MoU)
class MoUAdmin(admin.ModelAdmin):
    list_display = ("institution", "start_date", "end_date", "status", "signed_by_university", "signed_by_institution")
    list_filter = ("status", "start_date", "end_date")
    search_fields = ("institution__name", "signed_by_university", "signed_by_institution", "description")
    raw_id_fields = ("institution", "document")
    ordering = ("-end_date",)
