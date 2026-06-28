from django.apps import AppConfig
from django.db.models.signals import post_migrate


class UsersConfig(AppConfig):
    name = "modules.users"

    def ready(self):
        # Connect to post_migrate signal to create superuser automatically on startup/migrations
        post_migrate.connect(create_default_superuser, sender=self)


def create_default_superuser(sender, **kwargs):
    from django.contrib.auth import get_user_model
    from modules.users.models import UserRole

    User = get_user_model()
    try:
        if not User.objects.filter(is_superuser=True).exists():
            User.objects.create_superuser(
                username="admin",
                email="admin@karu.ac.ke",
                password="Karatina@2026",
                role=UserRole.ADMIN,
                is_approved=True
            )
            print("Successfully created default superuser: admin")
    except Exception:
        # Avoid breaking if database is not fully set up or tables don't exist yet
        pass
