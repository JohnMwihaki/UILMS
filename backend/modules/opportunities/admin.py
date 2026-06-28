from django.contrib import admin
from .models import Opportunity

@admin.register(Opportunity)
class OpportunityAdmin(admin.ModelAdmin):
    list_display = ("title", "institution", "type", "slots", "funding_amount", "application_deadline", "status")
    list_filter = ("type", "status", "research_area")
    search_fields = ("title", "description", "requirements", "institution__name")
    raw_id_fields = ("institution", "research_area")
    ordering = ("-created_at",)
