from modules.common.models import AuditLog

def log_action(user, action, module, details, ip_address=None):
    """
    Creates an audit log entry for the specified action.
    """
    return AuditLog.objects.create(
        user=user,
        action=action,
        module=module,
        details=details,
        ip_address=ip_address
    )
