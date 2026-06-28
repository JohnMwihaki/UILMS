import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models

class UserRole(models.TextChoices):
    ADMIN = "ADMIN", "Department Administrator"
    LECTURER = "LECTURER", "Lecturer"
    STUDENT = "STUDENT", "Student"

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.CharField(
        max_length=20,
        choices=UserRole.choices,
        default=UserRole.STUDENT
    )
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    is_approved = models.BooleanField(default=False)
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    department = models.ForeignKey(
        "academics.Department",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="users"
    )

    def save(self, *args, **kwargs):
        # Automatically approve administrators
        if self.role == UserRole.ADMIN:
            self.is_approved = True
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
