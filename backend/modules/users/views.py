from rest_framework import viewsets, permissions, status, views
from rest_framework.decorators import action
from rest_framework.response import Response
from modules.users.models import User
from modules.users.serializers import UserSerializer, RegisterSerializer
from modules.common.responses import success_response, error_response
from modules.common.services import log_action

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().select_related("department").order_by("username")
    serializer_class = UserSerializer

    def get_permissions(self):
        # Only Admins can manage all users or delete users
        if self.action in ["list", "destroy", "approve", "pending"]:
            return [permissions.IsAuthenticated(), permissions.BasePermission()] # verified by custom check below
        # Anyone can register
        if self.action == "create":
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def check_permissions(self, request):
        super().check_permissions(request)
        if self.action in ["list", "destroy", "approve", "pending"] and request.user.role != "ADMIN":
            self.permission_denied(request, message="Only administrators have access to this action.")

    def create(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        log_action(user=user, action="REGISTER", module="USER", details=f"Registered new user account: {user.username}")
        return success_response(
            data=UserSerializer(user).data,
            message="Registration successful. Wait for administrator approval if applicable.",
            status_code=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        user = self.get_object()
        user.is_approved = True
        user.save()
        log_action(user=request.user, action="APPROVE", module="USER", details=f"Approved user: {user.username}")
        return success_response(data=UserSerializer(user).data, message=f"Approved account for {user.username}.")

    @action(detail=False, methods=["get"])
    def pending(self, request):
        pending_users = User.objects.filter(is_approved=False).select_related("department")
        serializer = self.get_serializer(pending_users, many=True)
        return success_response(data=serializer.data)

class ProfileView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return success_response(data=serializer.data)

    def put(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        
        # Profile picture handling
        if "avatar" in request.FILES:
            user.avatar = request.FILES["avatar"]
            
        serializer.save()
        log_action(user=user, action="UPDATE_PROFILE", module="USER", details="Updated personal profile details.")
        return success_response(data=UserSerializer(user).data, message="Profile updated successfully.")
