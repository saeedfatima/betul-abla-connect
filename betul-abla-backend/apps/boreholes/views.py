from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def borehole_list(request):
    # Placeholder for borehole list endpoint
    return Response({
        'message': 'Borehole list endpoint',
        'data': []
    })