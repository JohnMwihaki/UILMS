from django.db import models
from django.conf import settings
from modules.organizations.models import Institution

class DocumentType(models.TextChoices):
    MOU = "MOU", "Memorandum of Understanding (MoU)"
    REPORT = "REPORT", "Report"
    LETTER = "LETTER", "Attachment/Internship Letter"
    ANNOUNCEMENT = "ANNOUNCEMENT", "Public Announcement"
    OTHER = "OTHER", "Other Document"

class MouStatus(models.TextChoices):
    ACTIVE = "ACTIVE", "Active"
    EXPIRED = "EXPIRED", "Expired"
    TERMINATED = "TERMINATED", "Terminated"

class Document(models.Model):
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to="documents/")
    institution = models.ForeignKey(
        Institution,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="documents"
    )
    document_type = models.CharField(
        max_length=20,
        choices=DocumentType.choices,
        default=DocumentType.OTHER
    )
    is_public = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="uploaded_documents"
    )

    def __str__(self):
        return f"{self.title} ({self.get_document_type_display()})"

class MoU(models.Model):
    institution = models.ForeignKey(
        Institution,
        on_delete=models.CASCADE,
        related_name="mous"
    )
    document = models.ForeignKey(
        Document,
        on_delete=models.PROTECT,
        related_name="mou_records"
    )
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(
        max_length=15,
        choices=MouStatus.choices,
        default=MouStatus.ACTIVE
    )
    signed_by_university = models.CharField(max_length=150)
    signed_by_institution = models.CharField(max_length=150)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "MoU"
        verbose_name_plural = "MoUs"

    def __str__(self):
        return f"MoU with {self.institution.name} ({self.start_date} to {self.end_date})"
