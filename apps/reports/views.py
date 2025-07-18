from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def report_list(request):
    # Placeholder for reports list endpoint
    return Response({
        'message': 'Reports list endpoint',
        'data': []
    })