from django.db import models

class CourseLevel(models.TextChoices):
    UNDERGRADUATE = "UNDERGRADUATE", "Undergraduate"
    POSTGRADUATE = "POSTGRADUATE", "Postgraduate"
    DIPLOMA = "DIPLOMA", "Diploma"
    CERTIFICATE = "CERTIFICATE", "Certificate"

class Department(models.Model):
    name = models.CharField(max_length=150, unique=True)
    code = models.CharField(max_length=10, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.code})"

class Course(models.Model):
    name = models.CharField(max_length=150, unique=True)
    code = models.CharField(max_length=15, unique=True)
    department = models.ForeignKey(
        Department,
        on_delete=models.CASCADE,
        related_name="courses"
    )
    level = models.CharField(
        max_length=20,
        choices=CourseLevel.choices,
        default=CourseLevel.UNDERGRADUATE
    )

    def __str__(self):
        return f"{self.name} ({self.code})"

class ResearchArea(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name
