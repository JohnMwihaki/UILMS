from django.contrib import admin
from .models import InstitutionCategory, Institution

@admin.register(InstitutionCategory)
class InstitutionCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "description")
    search_fields = ("name",)

@admin.register(Institution)
class InstitutionAdmin(admin.ModelAdmin):
    list_display = ("custom_id", "name", "category", "county", "status", "created_at")
    list_filter = ("category", "county", "status", "has_internship", "has_attachment", "has_joint_research")
    search_fields = ("custom_id", "name", "county", "contact_person_name", "contact_email")
    raw_id_fields = ("departments", "courses")
    ordering = ("custom_id",)
