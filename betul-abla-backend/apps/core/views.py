from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    # This will be expanded later with actual statistics
    return Response({
        'message': 'Dashboard statistics endpoint',
        'user': request.user.username,
        'role': request.user.role,
    })