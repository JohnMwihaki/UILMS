from django.db import models
from modules.organizations.models import Institution
from modules.academics.models import ResearchArea

class OpportunityType(models.TextChoices):
    INTERNSHIP = "INTERNSHIP", "Internship"
    ATTACHMENT = "ATTACHMENT", "Student Attachment"
    RESEARCH = "RESEARCH", "Research Collaboration"
    FUNDING = "FUNDING", "Funding Opportunity"

class OpportunityStatus(models.TextChoices):
    OPEN = "OPEN", "Open"
    CLOSED = "CLOSED", "Closed"

class Opportunity(models.Model):
    title = models.CharField(max_length=200)
    institution = models.ForeignKey(
        Institution,
        on_delete=models.CASCADE,
        related_name="opportunities"
    )
    type = models.CharField(
        max_length=20,
        choices=OpportunityType.choices
    )
    description = models.TextField()
    requirements = models.TextField(blank=True, null=True)
    slots = models.PositiveIntegerField(default=1)
    funding_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        blank=True,
        null=True,
        help_text="Optional funding amount (KES or USD)"
    )
    research_area = models.ForeignKey(
        ResearchArea,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="opportunities"
    )
    application_deadline = models.DateField(blank=True, null=True)
    status = models.CharField(
        max_length=10,
        choices=OpportunityStatus.choices,
        default=OpportunityStatus.OPEN
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Opportunities"

    def __str__(self):
        return f"{self.title} ({self.get_type_display()}) at {self.institution.name}"
