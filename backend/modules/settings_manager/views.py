from rest_framework import viewsets
from rest_framework.decorators import action
from modules.settings_manager.models import SystemSetting
from modules.settings_manager.serializers import SystemSettingSerializer
from modules.common.permissions import IsAdminOrReadOnly
from modules.common.services import log_action
from modules.common.responses import success_response, error_response

class SystemSettingViewSet(viewsets.ModelViewSet):
    queryset = SystemSetting.objects.all().order_by("key")
    serializer_class = SystemSettingSerializer
    permission_classes = [IsAdminOrReadOnly]

    def list(self, request, *args, **kwargs):
        # Return a flat dictionary of settings as expected by the frontend
        settings = SystemSetting.objects.all()
        flat_settings = {s.key: s.value for s in settings}
        
        # If database is empty, return default keys
        if not flat_settings:
            flat_settings = {
                "university_name": "Karatina University",
                "department_name": "Department of Biological and Physical Sciences",
                "representative_name": "Prof. John Doe",
                "representative_title": "Dean of School",
                "system_email": "linkages@karatina.ac.ke",
                "notify_on_mou_expiry": "true",
                "auto_approve_students": "false",
                "mou_expiry_warning_days": "30",
            }
        
        # Parse boolean-like strings or ints to actual types for frontend
        formatted_settings = {}
        for k, v in flat_settings.items():
            if v == "true":
                formatted_settings[k] = True
            elif v == "false":
                formatted_settings[k] = False
            elif v.isdigit():
                formatted_settings[k] = int(v)
            else:
                formatted_settings[k] = v

        return success_response(data=formatted_settings)

    @action(detail=False, methods=["post"])
    def update_settings(self, request):
        # Accepts a dictionary of key-value pairs and updates or creates them
        data = request.data
        if not isinstance(data, dict):
            return error_response("Invalid data format. Expected a dictionary of key-value settings.")

        for key, value in data.items():
            # Convert boolean to string for storing
            if isinstance(value, bool):
                val_str = "true" if value else "false"
            else:
                val_str = str(value)

            SystemSetting.objects.update_or_create(
                key=key,
                defaults={"value": val_str}
            )

        log_action(
            user=request.user,
            action="UPDATE",
            module="SETTING",
            details="Bulk updated system settings."
        )

        return success_response(message="System configurations updated successfully.")

    def perform_create(self, serializer):
        setting = serializer.save()
        log_action(
            user=self.request.user,
            action="CREATE",
            module="SETTING",
            details=f"Created system setting: {setting.key}={setting.value}"
        )

    def perform_update(self, serializer):
        setting = serializer.save()
        log_action(
            user=self.request.user,
            action="UPDATE",
            module="SETTING",
            details=f"Updated system setting: {setting.key}={setting.value}"
        )

    def perform_destroy(self, instance):
        log_action(
            user=self.request.user,
            action="DELETE",
            module="SETTING",
            details=f"Deleted system setting: {instance.key}"
        )
        instance.delete()
