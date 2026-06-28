from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ("username", "email", "role", "is_approved", "is_staff")
    list_filter = ("role", "is_approved", "is_staff", "is_superuser")
    fieldsets = UserAdmin.fieldsets + (
        ("Custom Fields", {"fields": ("role", "phone_number", "is_approved", "avatar", "department")}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Custom Fields", {"fields": ("role", "phone_number", "is_approved", "avatar", "department")}),
    )
