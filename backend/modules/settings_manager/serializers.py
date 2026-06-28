from rest_framework import serializers
from modules.settings_manager.models import SystemSetting

class SystemSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemSetting
        fields = ["key", "value", "description"]
