from rest_framework import serializers
from modules.academics.models import Department, Course, ResearchArea

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ["id", "name", "code", "description"]

class CourseSerializer(serializers.ModelSerializer):
    department_name = serializers.ReadOnlyField(source="department.name")
    department_code = serializers.ReadOnlyField(source="department.code")

    class Meta:
        model = Course
        fields = ["id", "name", "code", "department", "department_name", "department_code", "level"]

class ResearchAreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResearchArea
        fields = ["id", "name", "description"]
