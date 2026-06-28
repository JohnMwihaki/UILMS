from django.db import models
from modules.academics.models import Department, Course

class PartnerStatus(models.TextChoices):
    STRATEGIC = "STRATEGIC", "Strategic Partner"
    EMERGING = "EMERGING", "Emerging Partner"
    STANDARD = "STANDARD", "Standard Partner"

class InstitutionCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name_plural = "Institution Categories"

    def __str__(self):
        return self.name

class Institution(models.Model):
    custom_id = models.CharField(
        max_length=50,
        unique=True,
        help_text="Custom partnership ID e.g. BPS-021, PART002"
    )
    name = models.CharField(max_length=200, unique=True)
    category = models.ForeignKey(
        InstitutionCategory,
        on_delete=models.PROTECT,
        related_name="institutions"
    )
    county = models.CharField(max_length=100)
    address = models.TextField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    contact_email = models.EmailField(blank=True, null=True)
    contact_phone = models.CharField(max_length=50, blank=True, null=True)
    contact_person_name = models.CharField(max_length=100, blank=True, null=True)
    contact_person_role = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    logo = models.ImageField(upload_to="logos/", blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=PartnerStatus.choices,
        default=PartnerStatus.STANDARD
    )
    remarks = models.TextField(blank=True, null=True)

    # Academic relationships
    departments = models.ManyToManyField(
        Department,
        blank=True,
        related_name="collaborating_institutions"
    )
    courses = models.ManyToManyField(
        Course,
        blank=True,
        related_name="supporting_institutions"
    )

    # Quick Collaboration Areas flags
    has_internship = models.BooleanField(default=False)
    has_attachment = models.BooleanField(default=False)
    has_joint_research = models.BooleanField(default=False)
    has_staff_exchange = models.BooleanField(default=False)
    has_grant_writing = models.BooleanField(default=False)
    has_lab_training = models.BooleanField(default=False)
    has_curriculum_dev = models.BooleanField(default=False)
    has_funding = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.custom_id} - {self.name}"
