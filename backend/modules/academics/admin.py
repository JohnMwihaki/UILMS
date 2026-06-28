from django.contrib import admin
from .models import Department, Course, ResearchArea

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ("name", "code")
    search_fields = ("name", "code")

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("name", "code", "department", "level")
    list_filter = ("level", "department")
    search_fields = ("name", "code")

@admin.register(ResearchArea)
class ResearchAreaAdmin(admin.ModelAdmin):
    list_display = ("name", "description")
    search_fields = ("name",)
