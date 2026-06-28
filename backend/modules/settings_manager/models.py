from django.db import models

class SystemSetting(models.Model):
    key = models.CharField(max_length=100, unique=True, primary_key=True)
    value = models.TextField()
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.key
